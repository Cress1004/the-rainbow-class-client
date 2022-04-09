import React, { useState } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal, Form } from "antd";
import { transformAddressData } from "../../../../common/transformData";
import {
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
} from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../../common/function";
import useFetchVolunteerData from "../../../../../hook/Volunteer/useFetchVolunteerData";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import apis from "../../../../../apis";

const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function VolunteerDetail(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const volunteerData = useFetchVolunteerData(id);
  const currentUser = useFetchCurrentUserData();
  const userRole = currentUser.userRole;

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const fetchDeleteVolunteer = async (volunteerId) => {
    const data = await apis.volunteer.deleteVolunteer(volunteerId);
    if (data.success) {
      alert(t("delete_volunteer_success"));
      history.push("/volunteers");
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const deleteVolunteer = () => {
    setConfirmDelete(false);
    fetchDeleteVolunteer(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const transformRoleWithClass = (className, role) => {
    if (role === CLASS_MONITOR) return `${t("class_monitor")} - ${className}`;
    if (role === SUB_CLASS_MONITOR)
      return `${t("sub_class_monitor")} - ${className}`;
    return t("volunteer");
  };

  if (userRole.subRole === SUPER_ADMIN || !volunteerData) {
    return <PermissionDenied />;
  }

  return (
    <div className="volunteer-detail">
      <div className="volunteer-detail__title">{t("volunteer_detail")}</div>
      <Row className="volunteer-detail__action-row">
        {checkAdminAndMonitorRole(userRole) ? (
          <Button
            type="primary"
            className="volunteer-detail-volunteer-button"
          >
            <Link to={`/volunteers/${id}/edit`}>{t("edit_volunteer")}</Link>
          </Button>
        ) : null}
        {checkAdminAndMonitorRole(userRole) &&
        !checkAdminAndMonitorRole(volunteerData.role) ? (
          <Button
            type="danger"
            className="volunteer-detail__delete-volunteer-button"
            onClick={openDeletePopup}
          >
            {t("delete_volunteer")}
          </Button>
        ) : null}
      </Row>
      {volunteerData && (
        <>
          <Row>
            <Col className="volunteer-detail__left-block" span={6}>
              <img
                className="volunteer-detail__avatar"
                src={volunteerData.image}
                alt="user-avatar"
              ></img>
              <h3>{volunteerData.name}</h3>
            </Col>
            <Col className="volunteer-detail__right-block" span={18}>
              <Form {...layout} className="volunteer-detail__info-area">
                <Item label={t("user_name")}>{volunteerData.name}</Item>
                <Item label={t("email")}>{volunteerData.email}</Item>
                <Item label={t("address")}>
                  {transformAddressData(volunteerData.address)}
                </Item>
                <Item label={t("phone_number")}>
                  {volunteerData.phoneNumber}
                </Item>
                <Item label={t("role")}>
                  {transformRoleWithClass(
                    volunteerData.className,
                    volunteerData.volunteerRole
                  )}
                </Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
      <Modal
        title={t("modal_confirm_delete_volunteer_title")}
        visible={confirmDelete}
        onOk={deleteVolunteer}
        onCancel={cancelDelete}
        okText={t("delete_volunteer")}
        cancelText={t("cancel")}
        footer={[
          <Button onClick={cancelDelete}>{t("cancel")}</Button>,
          <Button onClick={deleteVolunteer} type="danger">
            {t("delete_volunteer")}
          </Button>,
        ]}
      >
        {t("modal_confirm_delete_volunteer_content")}
      </Modal>
    </div>
  );
}

export default VolunteerDetail;
