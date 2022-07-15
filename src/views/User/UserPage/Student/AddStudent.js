import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  DatePicker,
  Col,
  Row,
  message,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./student.scss";
import { FORMAT_DATE, phoneRegExp } from "../../../../common/constant";
import { checkAdminAndMonitorRole } from "../../../../common/function";
import PermissionDenied from "../../../../components/custom/Error/PermissionDenied";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import useFetchLocation from "../../../../hook/CommonData.js/useFetchLocation";
import useFetchStudentTypes from "../../../../hook/CommonData.js/useFetchStudentTypes";
import apis from "../../../../apis";
import { convertDateStringToMoment } from "../../../../common/transformData";
import useFetchAllClasses from "../../../../hook/Class/useFetchAllClasses";

const { Option } = Select;
const { Item } = Form;

function AddStudent(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [districts, setDistricts] = useState([]);
  const [address, setAddress] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});
  const classes = useFetchAllClasses();
  const currentUser = useFetchCurrentUserData();
  const location = useFetchLocation();
  const studentTypes = useFetchStudentTypes();

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

  const fetchAddStudent = async (dataToSend) => {
    const data = await apis.student.addStudent(dataToSend);
    if (data.success) {
      message.success("Add new student success");
      history.push("/students");
    } else if (!data.success) {
      alert(data.message);
    } else {
      alert(t("fail_to_get_api"));
    }
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
      birthday: "",
      admissionDay: convertDateStringToMoment(new Date()),
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
      birthday: Yup.string().required(t("required_birthday")).nullable(),
      admissionDay: Yup.string()
        .required(t("required_admission_day"))
        .nullable(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        const valuesToSend = { ...values, address };
        fetchAddStudent({ studentData: valuesToSend });
        setSubmitting(false);
      }, 400);
    },
  });

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
      !formik.errors.class &&
      !formik.errors.birthday &&
      !formik.errors.admissionDay &&
      formik.touched.name &&
      formik.touched.email &&
      formik.touched.phoneNumber
    );
  };

  if (!checkAdminAndMonitorRole(currentUser.userRole))
    return <PermissionDenied />;

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
        <Row>
          <Col span={3}></Col>
          <Col span={10}>
            <Item label={t("birthday")} wrapperCol={{ span: 10 }} required>
              <DatePicker
                format={FORMAT_DATE}
                name="birthday"
                onChange={(dateString) =>
                  formik.setFieldValue("birthday", dateString)
                }
                placeholder={t("date_placeholder")}
              />
              {formik.errors ? (
                <span className="custom__error-message">
                  {formik.errors.birthday}
                </span>
              ) : null}
            </Item>
          </Col>
          <Col span={10}>
            <Item name="gender" label={t("gender")} wrapperCol={{ span: 10 }}>
              <Radio.Group
                defaultValue={0}
                onChange={(e) => formik.setFieldValue("gender", e.target.value)}
              >
                <Radio value={0}>{t("male")}</Radio>
                <Radio value={1}>{t("female")}</Radio>
              </Radio.Group>
            </Item>
          </Col>
        </Row>
        <Item label={t("parent_name")}>
          <Input
            name="parentName"
            placeholder={t("input_parent_name")}
            value={formik.values.parentName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Item>
        <Item
          label={t("address")}
          className="add-student__input-address-select-form"
        >
          <Select
            showSearch
            placeholder={t("input_province")}
            onChange={handleChangeProvice}
            value={province?.name}
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
            value={district?.name}
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
            value={ward?.name}
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
        <Row>
          <Col span={3}></Col>
          <Col span={10}>
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
                <span className="custom__error-message">
                  {formik.errors.class}
                </span>
              )}
            </Item>
          </Col>
          <Col span={11}>
            <Item
              label={t("admission_day")}
              wrapperCol={{ span: 17, offset: 1 }}
              required
            >
              <DatePicker
                format={FORMAT_DATE}
                defaultValue={formik.values.admissionDay}
                name="admissionDay"
                onChange={(dateString) =>
                  formik.setFieldValue("admissionDay", dateString)
                }
                placeholder={t("date_placeholder")}
              />
              {formik.errors.admissionDay ? (
                <span className="custom__error-message">
                  {formik.errors.admissionDay}
                </span>
              ) : null}
            </Item>
          </Col>
        </Row>
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
