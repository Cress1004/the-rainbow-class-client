import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Form, Input, Select, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./volunteer.scss";
import { phoneRegExp, urlRegExp } from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../../common/function";
import useFetchAllClasses from "../../../../../hook/Class/useFetchAllClasses";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import apis from "../../../../../apis";

const { Option } = Select;

function AddVolunteer(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData.userRole;
  const classes = useFetchAllClasses();

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const fetchAddVolunteer = async (valuesToSend) => {
    const data = await apis.volunteer.addVolunteer(valuesToSend);
    if (data.success) {
      history.push("/volunteers");
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      class: "",
      linkFacebook: "",
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
      linkFacebook: Yup.string().matches(urlRegExp, t("link_is_invalid")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        fetchAddVolunteer({ volunteerData: values, userId: userId });
        setSubmitting(false);
      }, 400);
    },
  });

  const fieldError = (formik) => {
    return (
      !formik.errors.name &&
      !formik.errors.email &&
      !formik.errors.phoneNumber &&
      !formik.errors.class &&
      !formik.errors.linkFacebook &&
      formik.touched.name &&
      formik.touched.email &&
      formik.touched.phoneNumber
    );
  };

  if (!checkAdminAndMonitorRole(userRole)) return <PermissionDenied />;

  return (
    <div className="add-volunteer">
      {classes ? (
        <div>
          <div className="add-volunteer__title">{t("add_volunteer")}</div>
          <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
            <Form.Item label={t("user_name")} required>
              <Input
                name="name"
                placeholder={t("input_name")}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.name && formik.touched.name && (
                <span className="custom__error-message">
                  {formik.errors.name}
                </span>
              )}
            </Form.Item>
            <Form.Item label={t("email")} required>
              <Input
                name="email"
                placeholder={t("input_email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email && (
                <span className="custom__error-message">
                  {formik.errors.email}
                </span>
              )}
            </Form.Item>
            <Form.Item label={t("phone_number")} required>
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
            </Form.Item>
            <Form.Item label={t("class")} required>
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
                {classes.map((option) => (
                  <Option key={option._id} value={option._id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
              {formik.errors.class && formik.touched.class && (
                <span className="custom__error-message">
                  {formik.errors.class}
                </span>
              )}
            </Form.Item>
            <Form.Item label={t("link_facebook")}>
              <Input
                name="linkFacebook"
                placeholder={t("input_link_facebook")}
                value={formik.values.linkFacebook}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.linkFacebook ? (
                <span className="custom__error-message">
                  {formik.errors.linkFacebook}
                </span>
              ) : null}
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                className={!fieldError(formik) ? "disable-submit-button" : ""}
                disabled={!fieldError(formik)}
              >
                {t("register")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : null}
    </div>
  );
}

export default AddVolunteer;
