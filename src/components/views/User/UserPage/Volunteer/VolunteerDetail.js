import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal, Form } from "antd";
import { transformAddressData } from "../../../../common/transformData";
import Axios from "axios";
import {
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
} from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../../common/function";

const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function VolunteerDetail(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const [volunteerData, setVolunteerData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userRole, setUserRole] = useState({});

  useEffect(() => {
    Axios.post(`/api/users/get-role`, { userId: userId }).then((response) => {
      if (response.data.success) {
        const data = response.data.userRole;
        setUserRole(data);
      }
    });
    Axios.post(`/api/volunteers/${id}`, { id: id, userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data.volunteer;
          data
            ? setVolunteerData({
                id: data._id,
                name: data.user.name,
                email: data.user.email,
                gender: data.user.gender,
                image: data.user.image,
                address: transformAddressData(data.user.address),
                phoneNumber: data.user.phoneNumber,
                role: data.role,
                className: data.user.class ? data.user.class.name : t("unset"),
              })
            : setVolunteerData(null);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, id, userId]);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteVolunteer = () => {
    setConfirmDelete(false);
    Axios.post(`/api/volunteers/${id}/delete`, {
      volunteerId: id,
      userId: userId,
    }).then((response) => {
      if (response.data.success) {
        alert(t("delete_volunteer_success"));
        history.push("/volunteers");
      } else {
        alert(t("fail_to_delete_volunteer"));
      }
    });
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
      <Row>
        <Col span={14} />
        {checkAdminAndMonitorRole(userRole) ? (
          <Col span={6}>
            <Button type="primary" className="edit-volunteer-button">
              <Link to={`/volunteers/${id}/edit`}>{t("edit_volunteer")}</Link>
            </Button>
          </Col>
        ) : null}
        {checkAdminAndMonitorRole(userRole) ? (
          <Col span={4}>
            <Button
              type="danger"
              className="delete-volunteer-button"
              onClick={openDeletePopup}
            >
              {t("delete_volunteer")}
            </Button>
          </Col>
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
                <Item label={t("address")}>{volunteerData.address}</Item>
                <Item label={t("phone_number")}>
                  {volunteerData.phoneNumber}
                </Item>
                <Item label={t("role")}>
                  {transformRoleWithClass(
                    volunteerData.className,
                    volunteerData.role
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
