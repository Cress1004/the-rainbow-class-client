import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Form, Input, Select, Button, Radio } from "antd";
import Axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./student.scss";
import useFetchRole from "../../../../../hook/useFetchRole";
import { phoneRegExp } from "../../../../common/constant";
import { checkAdminAndMonitorRole } from "../../../../common/function";
import PermissionDenied from "../../../Error/PermissionDenied";

const { Option } = Select;
const { Item } = Form;

function AddStudent(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [studentTypes, setStudentTypes] = useState([]);
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [address, setAddress] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});
  const [classes, setClasses] = useState({});
  const userId = localStorage.getItem("userId");
  const userRole = useFetchRole(userId).userRole;

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      parentName: "",
      gender: "",
      studentTypes: "",
      class: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("required_name_message")),
      email: Yup.string()
        .email(t("invalid_email_message"))
        .required(t("required_email_message")),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, t("invalid_phone_number"))
        .required(t("required_phone_number_message")),
      class: Yup.string().required(t("required_class_message")),
      studentTypes: Yup.array().required(t("required_studentType_message")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        const valuesToSend = { ...values, address };
        Axios.post("/api/students/add-student", {
          studentData: valuesToSend,
        }).then((response) => {
          if (response.data.success) {
            history.push("/students");
          } else if (!response.data.success) {
            alert(response.data.message);
          } else {
            alert(t("fail_to_get_api"));
          }
        });
        setSubmitting(false);
      }, 400);
    },
  });

  useEffect(() => {
    Axios.post("/api/common-data/student-types", null).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } 
    });
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } 
    });
    Axios.post(`/api/classes/get-all-classes`, null).then(
      (response) => {
        if (response.data.success) {
          setClasses(response.data.classes);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, userId]);

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    setDistricts(currentProvince.districts);
    setDistrict({});
    setWard({});
    setAddress({
      ...address,
      address: {
        province: {
          id: currentProvince.id,
          name: currentProvince.name,
        },
      },
    });
  };

  const handleChangeDistrict = (value) => {
    const currentDistrict = districts.find((item) => value === item.id);
    setDistrict({ id: currentDistrict.id, name: currentDistrict.name });
    setWards(currentDistrict.wards);
    setWard({});
    setAddress({
      ...address,
      address: {
        province: address.address.province,
        district: {
          id: currentDistrict.id,
          name: currentDistrict.name,
        },
      },
    });
  };

  const handleChangeWard = (value) => {
    const currentWard = wards.find((item) => value === item.id);
    setWard({ id: currentWard.id, name: currentWard.name });
    setAddress({
      ...address,
      address: {
        province: address.address.province,
        district: address.address.district,
        ward: {
          id: currentWard.id,
          name: currentWard.name,
        },
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setAddress({
      ...address,
      description: e.target.value,
    });
  };

  const fieldError = (formik) => {
    return (
      !formik.errors.name &&
      !formik.errors.email &&
      !formik.errors.phoneNumber &&
      !formik.errors.studentTypes &&
      !formik.errors.class &&
      formik.touched.name &&
      formik.touched.email &&
      formik.touched.phoneNumber
    );
  };

  if (!checkAdminAndMonitorRole(userRole)) return <PermissionDenied />;

  return (
    <div className="add-student">
      <div className="add-student__title">{t("add_student")}</div>
      <Form
        {...layout}
        name="control-hooks"
        className="add-student__form"
        onSubmit={formik.handleSubmit}
      >
        <Item label={t("user_name")} required>
          <Input
            name="name"
            placeholder={t("input_name")}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && formik.touched.name && (
            <span className="custom__error-message">{formik.errors.name}</span>
          )}
        </Item>
        <Item label={t("email")} required>
          <Input
            name="email"
            placeholder={t("input_email")}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <span className="custom__error-message">{formik.errors.email}</span>
          )}
        </Item>
        <Item label={t("phone_number")} required>
          <Input
            name="phoneNumber"
            placeholder={t("input_phone_number")}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <span className="custom__error-message">
              {formik.errors.phoneNumber}
            </span>
          )}
        </Item>
        <Item label={t("parent_name")}>
          <Input
            name="parentName"
            placeholder={t("input_parent_name")}
            value={formik.values.parentName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Item>
        <Item name="gender" label={t("gender")}>
          <Radio.Group
            defaultValue={0}
            onChange={(e) => formik.setFieldValue("gender", e.target.value)}
          >
            <Radio value={0}>{t("male")}</Radio>
            <Radio value={1}>{t("female")}</Radio>
          </Radio.Group>
        </Item>
        <Item
          label={t("address")}
          className="add-student__input-address-select-form"
        >
          <Select
            showSearch
            placeholder={t("input_province")}
            onChange={handleChangeProvice}
          >
            {location.map((option) => (
              <Option key={option._id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
          <Select
            showSearch
            placeholder={t("input_district")}
            onChange={handleChangeDistrict}
            className="add-student__input-address-center-form"
          >
            {districts.length
              ? districts.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Select
            showSearch
            placeholder={t("input_ward")}
            onChange={handleChangeWard}
          >
            {wards.length
              ? wards.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Input
            onChange={(e) => handleChangeAddressDescription(e)}
            placeholder={t("input_specific_address")}
          />
        </Item>
        <Item label={t("student_type")} required>
          <Select
            mode="multiple"
            showSearch
            placeholder={t("input_student_type")}
            onChange={(value) => formik.setFieldValue("studentTypes", value)}
          >
            {studentTypes.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
          {formik.errors.studentTypes && formik.touched.studentTypes && (
            <span className="custom__error-message">
              {formik.errors.studentTypes}
            </span>
          )}
        </Item>
        <Item label={t("class")} required>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "10px",
            }}
            placeholder={t("input_class")}
            onChange={(value) => formik.setFieldValue("class", value)}
          >
            {classes.length
              ? classes.map((option) => (
                  <Option key={option._id} value={option._id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          {formik.errors.class && formik.touched.class && (
            <span className="custom__error-message">{formik.errors.class}</span>
          )}
        </Item>
        <Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            className={!fieldError(formik) ? "disable-submit-button" : ""}
            disabled={!fieldError(formik)}
          >
            {t("register")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default AddStudent;
