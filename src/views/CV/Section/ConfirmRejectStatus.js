import { Modal } from "antd";
import React from "react";

function ConfirmRejectStatus(props) {
  const { t, confirmReject, formik, setConfirmReject } = props;
  return (
    <Modal
      title={t("confirm_reject_status")}
      visible={confirmReject}
      onOk={formik.handleSubmit}
      onCancel={() => setConfirmReject(false)}
    >
      {t("reject_this_CV_and_cannot_change_status")}
    </Modal>
  );
}

export default ConfirmRejectStatus;
