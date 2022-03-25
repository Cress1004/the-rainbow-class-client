import React, { useState } from "react";
import { withRouter, useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button, Typography } from "antd";
import Axios from "axios";

import "./ResetPassword.scss";
import { STATUS } from "../../../common/constant";
import CustomFlashMessage from "../../FlashMessage/CustomFlashMessage";

const { Title } = Typography;
const { Item } = Form;

function ResetPassword(props) {
  const { t } = useTranslation();
  const search = useLocation().search;
  const verifyToken = new URLSearchParams(search).get("verifyToken");
  const [message, setMessage] = useState({});
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      resetEmail: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      resetEmail: Yup.string()
        .email(t("invalid_email_message"))
        .required("required_email_message"),
      newPassword: Yup.string()
        .required(t("required_new_password_message"))
        .min(8, t("new_password_must_be_longer_than_8_charaters")),
      confirmPassword: Yup.string()
        .required(t("required_confirm_password_message"))
        .min(8, t("confirm_password_must_be_longer_than_8_charaters"))
        .oneOf(
          [Yup.ref("newPassword"), null],
          t("confirm_password_must_match_with_new_password")
        ),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        Axios.post(`api/users/set-new-password`, {
          resetEmail: values.resetEmail,
          verifyToken: verifyToken,
          newPassword: values.newPassword,
        }).then((response) => {
          if (response.data.success) {
            setMessage({
              type: STATUS.success,
              content: t("reset_password_success"),
              showFlashMessage: true,
            });
          } else if (!response.data.success) {
            setMessage({
              type: STATUS.error,
              content: response.data.message,
              showFlashMessage: true,
            });
          } else {
            setMessage({
              type: STATUS.error,
              content: t("some_thing_went_wrong"),
              showFlashMessage: true,
            });
          }
        });
        setSubmitting(false);
      }, 400);
      history.push("/login");
    },
  });

  return (
    <div className="resetpwd-area">
      {message.showFlashMessage ? (
        <CustomFlashMessage message={message} />
      ) : null}
      <Title level={2} style={{ textAlign: "center", marginBottom: "12%" }}>
        {t("reset_password")}
      </Title>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onSubmit={formik.handleSubmit}
        style={{ width: "100%" }}
      >
        <Item label={t("email")} required>
          <Input
            name="resetEmail"
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("input_email")}
            type="email"
            value={formik.values.resetEmail}
            onChange={formik.handleChange}
          />
          {formik.errors.resetEmail ? (
            <span className="custom__error-message">
              {formik.errors.resetEmail}
            </span>
          ) : null}
        </Item>
        <Item label={t("new_password")} required>
          <Input
            name="newPassword"
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("input_password")}
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
          />
          {formik.errors.newPassword ? (
            <span className="custom__error-message">
              {formik.errors.newPassword}
            </span>
          ) : null}
        </Item>
        <Item label={t("password_confirm")} required>
          <Input
            name="confirmPassword"
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder={t("input_password_confirm")}
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
          {formik.errors.confirmPassword ? (
            <span className="custom__error-message">
              {formik.errors.confirmPassword}
            </span>
          ) : null}
        </Item>
        <a className="back_to_login" href="/login" style={{ float: "right" }}>
          {t("back_to_login")}
        </a>
        <div style={{ marginTop: "20%" }}>
          <Button
            type="primary"
            htmlType="submit"
            className={
              formik.values.resetEmail === "" ||
              formik.values.newPassword === "" ||
              formik.values.confirmPassword === "" ||
              formik.errors.resetEmail ||
              formik.errors.newPassword ||
              formik.errors.confirmPassword
                ? "login-button-disable"
                : "login-button-enable"
            }
            disabled={
              formik.values.resetEmail === "" ||
              formik.values.newPassword === "" ||
              formik.values.confirmPassword === "" ||
              formik.errors.resetEmail ||
              formik.errors.newPassword ||
              formik.errors.confirmPassword ||
              formik.isSubmitting
            }
            onSubmit={formik.handleSubmit}
          >
            {t("reset_password")}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default withRouter(ResetPassword);
