import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./LoginPage.scss";
import { Modal, Button, Form, Input } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import CustomFlashMessage from "../../FlashMessage/CustomFlashMessage";
import { STATUS } from "../../../common/constant";

function ResetPassword(props) {
  const { t } = useTranslation();
  const [showPopupResetPassword, setPopupResetPassword] = useState(false);
  const [message, setMessage] = useState({});

  const formik = useFormik({
    initialValues: {
      resetEmail: "",
    },
    validationSchema: Yup.object({
      resetEmail: Yup.string()
        .email(t("invalid_email_message"))
        .required("required_email_message"),
    }),
    onSubmit: (values) => {
      Axios.post(`api/users/reset-password`, {
        resetEmail: values.resetEmail,
      }).then((response) => {
        if (response.data.success) {
          formik.values.resetEmail = "";
          setPopupResetPassword(false);
          setMessage({
            type: STATUS.success,
            content: t("reset_email_was_sent"),
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
    },
  });

  const showModal = () => {
    setMessage({});
    setPopupResetPassword(true);
  };

  const handleCancel = () => {
    setMessage({});
    setPopupResetPassword(false);
  };

  return (
    <div>
      {message.showFlashMessage ? (
        <CustomFlashMessage message={message} />
      ) : null}
      <a
        href={() => false}
        className="login-form-forgot"
        onClick={showModal}
        style={{ float: "right" }}
      >
        {t("forgot_password")}
      </a>
      <Modal
        className="reset-password-modal"
        title={t("reset_password")}
        onCancel={handleCancel}
        visible={showPopupResetPassword}
        footer={[
          <Button onClick={handleCancel}>{t("cancel")}</Button>,
          <Button
            type="primary"
            onClick={formik.handleSubmit}
            className={
              formik.errors.resetEmail || formik.values.resetEmail === ""
                ? "reset-pass-button-disable"
                : ""
            }
            disabled={
              formik.errors.resetEmail || formik.values.resetEmail === ""
            }
          >
            {t("ok")}
          </Button>,
        ]}
      >
        <p>{t("reset_password_message")}</p>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <Input
              type="email"
              name="resetEmail"
              value={formik.values.resetEmail}
              onChange={formik.handleChange}
            />
            {formik.errors.resetEmail ? (
              <p className="custom__error-message">
                {formik.errors.resetEmail}
              </p>
            ) : null}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ResetPassword;
