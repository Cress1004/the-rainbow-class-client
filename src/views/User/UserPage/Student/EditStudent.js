import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Radio } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./student.scss";
import { phoneRegExp } from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../../common/function";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import useFetchLocation from "../../../../hook/CommonData.js/useFetchLocation";
import useFetchStudentTypes from "../../../../hook/CommonData.js/useFetchStudentTypes";
import apis from "../../../../apis";
import useFetchAllClasses from "../../../../hook/Class/useFetchAllClasses";
import useFetchStudentData from "../../../../hook/Student/useFetchStudentData";

const { Option } = Select;
const { Item } = Form;

function EditStudent(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [address, setAddress] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});
  const userData = useFetchCurrentUserData();
  const userRole = userData.userRole;
  const location = useFetchLocation();
  const studentTypes = useFetchStudentTypes();
  const classes = useFetchAllClasses();
  const studentData = useFetchStudentData(id);

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const fetchDistricts = async (provinceId) => {
    const data = await apis.commonData.getDistricts(provinceId);
    if (data.success) {
      setDistricts(data.districts);
    }
  };

  const fetchWards = async (provinceId, districtId) => {
    const data = await apis.commonData.getWards(provinceId, districtId);
    if (data.success) {
      setWards(data.wards);
    }
  };

  const fetchEditStudent = async (valueToSend) => {
    const data = await apis.student.editStudent(valueToSend);
    if (data.success) {
      history.push("/students");
    } else if (!data.success) {
      alert(data.message);
    } else {
      alert(t("fail_to_get_api"));
    }
  };

  const formik = useFormik({
    initialValues: studentData ? studentData : {},
    enableReinitialize: true,
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
        fetchEditStudent({ studentData: valuesToSend });
        setSubmitting(false);
      }, 400);
    },
  });

  useEffect(() => {
    const addressData = studentData.address;
    if (addressData) {
      setAddress(addressData);
      setProvince(addressData.address?.province);
      setDistrict(addressData.address?.district);
      setWard(addressData.address?.ward);
      fetchDistricts(addressData.address?.province.id);
      fetchWards(
        addressData.address?.province.id,
        addressData.address?.district.id
      );
    }
  }, [studentData]);

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    fetchDistricts(currentProvince.id);
    setWards([]);
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
    fetchWards(province.id, currentDistrict.id);
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
      !formik.errors.class
    );
  };

  if (!checkAdminAndMonitorRole(userRole)) return <PermissionDenied />;

  return (
    <div className="edit-student">
      <div className="edit-student__title">{t("edit_student")}</div>
      <Form
        {...layout}
        name="control-hooks"
        className="edit-student__form"
        onSubmit={formik.handleSubmit}
      >
        <Item label={t("user_name")} required>
          <Input
            name="name"
            value={formik.values.name}
            placeholder={t("input_name")}
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
            value={formik.values.email}
            placeholder={t("input_email")}
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
            value={formik.values.phoneNumber}
            placeholder={t("input_phone_number")}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
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
            value={formik.values.parentName}
            placeholder={t("input_parent_name")}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </Item>
        <Item name="gender" label={t("gender")}>
          <Radio.Group
            value={formik.values.gender}
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
            value={province?.name}
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
            value={district?.name}
            showSearch
            placeholder={t("input_district")}
            onChange={handleChangeDistrict}
            className="edit-student__input-address-center-form"
          >
            {districts?.length
              ? districts.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Select
            value={ward?.name}
            showSearch
            placeholder={t("input_ward")}
            onChange={handleChangeWard}
          >
            {wards?.length
              ? wards.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Input
            value={address.description}
            onChange={(e) => handleChangeAddressDescription(e)}
            placeholder={t("input_specific_address")}
          />
        </Item>
        <Item label={t("student_type")} required>
          <Select
            mode="multiple"
            showSearch
            value={formik.values.studentTypes}
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
            value={formik.values.class}
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
            {t("update")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default EditStudent;
