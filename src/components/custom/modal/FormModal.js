import React from "react";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";

function FormModal(props) {
  const { t } = useTranslation();

  const {
    handleCancel,
    handleOk,
    title,
    content,
    visible,
    disableOkButton,
    isUpdate,
    isSubmitting,
  } = props;
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t("cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={isSubmitting}
          disabled={disableOkButton || isSubmitting}
        >
          {isUpdate ? t("update") : t("register")}
        </Button>,
      ]}
    >
      {content}
    </Modal>
  );
}

export default FormModal;
