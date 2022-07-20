import { Modal } from "antd";
import React from "react";

function ConfirmPassStatus(props) {
  const { t, confirmPass, formik, setConfirmPass } = props;
  return (
    <Modal
      title={t("confirm_pass_status")}
      visible={confirmPass}
      onOk={formik.handleSubmit}
      onCancel={() => setConfirmPass(false)}
    >
      {t("approve_this_CV_and_cannot_change_status")}
    </Modal>
  );
}

export default ConfirmPassStatus;
