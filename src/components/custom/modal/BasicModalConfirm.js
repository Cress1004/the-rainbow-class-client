import React from "react";
import { Modal } from "antd";

function BasicModalConfirm(props) {
  const { handleCancel, handleOk, title, content, visible } = props;
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {content}
    </Modal>
  );
}

export default BasicModalConfirm;
