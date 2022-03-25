import React, { useState } from "react";
import Axios from "axios";
import { Modal, Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

const { Item } = Form;

function ChangePassword(props) {
  const { t } = useTranslation();
  const { showChangePassword, userId, layout, hideChangePasswordPopup } = props;
  const [beErrorMess, setBeErrorMess] = useState("");

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassWord: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required(t("required_old_password_message"))
        .min(8, t("password_must_be_longer_than_8_charaters")),
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
        Axios.post(`/api/users/change-password`, {
          password: values,
          userId: userId,
        }).then((response) => {
          if (response.data.success) {
            hideChangePasswordPopup();
            formik.resetForm({
              values: { oldPassword: "", newPassWord: "", confirmPassword: "" },
            });
            setBeErrorMess("");
          } else if (!response.data.success) {
            setBeErrorMess(t("old_password_is_not_match"));
          } else {
            alert(t("fail_to_save_avatar"));
          }
        });
        setSubmitting(false);
      }, 400);
    },
  });

  return (
    <div>
      <Modal
        className="profile__change-password"
        title={t("modal_change_password_title")}
        visible={showChangePassword}
        onCancel={() => hideChangePasswordPopup()}
        okText={t("change_password")}
        cancelText={t("cancel")}
        footer={[
          <Button
            type="primary"
            // className={
            //   errorMessage ? "disable-submit-button" : "enable-submit-lesson"
            // }
            onClick={formik.handleSubmit}
          >
            {t("change_password")}
          </Button>,
          <Button onClick={() => hideChangePasswordPopup()}>
            {t("cancel")}
          </Button>,
        ]}
      >
        <Form
          {...layout}
          className="profile__change-password-form"
          onSubmit={formik.handleSubmit}
        >
          <Item label={t("old_password")}>
            <Input
              name="oldPassword"
              type="password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {beErrorMess !== "" && (
              <span className="custom__error-message">{beErrorMess}</span>
            )}
            {formik.errors.oldPassword && formik.touched.oldPassword && (
              <span className="custom__error-message">
                {formik.errors.oldPassword}
              </span>
            )}
          </Item>
          <Item label={t("new_password")}>
            <Input
              name="newPassword"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.newPassword && formik.touched.newPassword && (
              <span className="custom__error-message">
                {formik.errors.newPassword}
              </span>
            )}
          </Item>
          <Item label={t("confirm_new_password")}>
            <Input
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.confirmPassword &&
              formik.touched.confirmPassword && (
                <span className="custom__error-message">
                  {formik.errors.confirmPassword}
                </span>
              )}
          </Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ChangePassword;
