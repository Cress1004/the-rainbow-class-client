import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Form, Icon, Input, Button, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { loginUser } from "../../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import "./LoginPage.scss";
import ResetPassword from "./ResetPassword";

const { Title } = Typography;

function LoginPage(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formErrorMessage, setFormErrorMessage] = useState("");

  return (
    <div className="login-area">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(t("invalid_email_message"))
            .required(t("required_email_message")),
          password: Yup.string()
            .min(8, t("required_min_length_of_password_message"))
            .required(t("required_password_message")),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            let dataToSubmit = {
              email: values.email,
              password: values.password,
            };

            dispatch(loginUser(dataToSubmit))
              .then((response) => {
                if (response.payload.loginSuccess) {
                  window.localStorage.setItem(
                    "userId",
                    response.payload.userId
                  );
                  props.history.push("/");
                } else {
                  setFormErrorMessage(t("error_email_or_password_message"));
                }
              })
              .catch((err) => {
                setFormErrorMessage(t("fail_to_login"));
                setTimeout(() => {
                  setFormErrorMessage("");
                }, 3000);
              });
            setSubmitting(false);
          }, 500);
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;
          return (
            <div>
              <Title
                level={2}
                style={{ textAlign: "center", marginBottom: "12%" }}
              >
                {t("login")}
              </Title>
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onSubmit={handleSubmit}
                style={{ width: "100%" }}
              >
                <Form.Item label={t("email")} required>
                  <Input
                    id="email"
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder={t("input_email")}
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item label={t("password")} required>
                  <Input
                    id="password"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder={t("input_password")}
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </Form.Item>
                {formErrorMessage && (
                  <label>
                    <p
                      style={{
                        color: "#ff0000bf",
                        fontSize: "0.7rem",
                        border: "1px solid",
                        padding: "1rem",
                        borderRadius: "10px",
                      }}
                    >
                      {formErrorMessage}
                    </p>
                  </label>
                )}
                <ResetPassword />
                <div
                  style={{
                    marginTop: "20%",
                    width: "100%",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={
                      values.email === "" ||
                      values.password === "" ||
                      errors.email ||
                      errors.password
                        ? "login-button-disable"
                        : "login-button-enable"
                    }
                    disabled={
                      isSubmitting ||
                      values.email === "" ||
                      values.password === "" ||
                      errors.email ||
                      errors.password
                    }
                    onSubmit={handleSubmit}
                  >
                    {t("login")}
                  </Button>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default withRouter(LoginPage);
