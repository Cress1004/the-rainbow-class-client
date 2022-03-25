import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal, Icon, Menu, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import Axios from "axios";
import {
  getArrayLength,
  transformAddressData,
  transformSchedule,
  transformStudentTypes,
} from "../../common/transformData";
import LessonList from "./Lesson/LessonList";
import useFetchRole from "../../../hook/useFetchRole";
import { checkAdminAndMonitorRole } from "../../common/function";
import {
  checkCurrentMonitorBelongToCurrentClass,
  checkCurrentUserBelongToCurrentClass,
  checkCurrentVolunteerBelongToCurrentClass,
} from "../../common/checkRole";
import { SUPER_ADMIN } from "../../common/constant";
import PermissionDenied from "../Error/PermissionDenied";
import useFetchClassData from "../../../hook/useFetchClassData";

function ClassDetail(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const userId = localStorage.getItem("userId");
  const currentUserData = useFetchRole(userId);
  const userRole = currentUserData.userRole;

  const classData = useFetchClassData(id);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteClass = () => {
    setConfirmDelete(false);
    Axios.post(`/api/classes/${id}/delete`, { classId: id }).then(
      (response) => {
        if (response.data.success) {
          alert(t("delete_class_success"));
          history.push("/classes");
        } else {
          alert(t("fail_to_delete_class"));
        }
      }
    );
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const menu = (
    <Menu>
      {checkCurrentMonitorBelongToCurrentClass(currentUserData, id) ? (
        <Menu.Item key="edit-class">
          <Link to={`/classes/${id}/edit`}>{t("edit_class")}</Link>
        </Menu.Item>
      ) : null}
      {checkCurrentMonitorBelongToCurrentClass(currentUserData, id) ? (
        <Menu.Item key="set-monitor">
          <Link to={`/classes/${id}/set-monitor`}>{t("set_monitor")}</Link>
        </Menu.Item>
      ) : null}
      {checkCurrentVolunteerBelongToCurrentClass(currentUserData, id) ? (
        <Menu.Item key="comment-student">
          <Link to={`/classes/${id}/comment-student`}>
            {t("comment_student")}
          </Link>
        </Menu.Item>
      ) : null}
      {checkCurrentMonitorBelongToCurrentClass(currentUserData, id) ? (
          <Menu.Item 
            key="delete-class"
            className="class-detail__delete-class"
            onClick={openDeletePopup}
          >
            {t("delete_class")}
          </Menu.Item>
      ) : null}
    </Menu>
  );

  if (!userRole || userRole.subRole === SUPER_ADMIN)
    return <PermissionDenied />;

  return (
    <div>
      <div className="class-detail">
        <Row>
          <div className="class-detail__title">{t("class_detail")}</div>
          {currentUserData &&
            checkAdminAndMonitorRole(currentUserData.userRole) && (
              <div className="class-detail__more-option">
                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    href={() => false}
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Icon type="more" />
                  </a>
                </Dropdown>
              </div>
            )}
        </Row>
        <div className="class-detail__info-area">
          {" "}
          {classData && (
            <>
              <Row>
                <Col span={4} className="label-text">
                  {t("class_name")}
                </Col>
                <Col span={16}>{classData.name}</Col>
              </Row>
              <Row>
                <Col span={4} className="label-text">
                  {t("description")}
                </Col>
                <Col span={16}>{classData.description}</Col>
              </Row>
              <Row>
                <Col span={4} className="label-text">
                  {t("address")}
                </Col>
                <Col span={16}>{transformAddressData(classData.address)}</Col>
              </Row>
              <Row>
                <Col span={4} className="label-text">
                  {t("target_student")}
                </Col>
                <Col span={16}>
                  {transformStudentTypes(classData.studentTypes)}
                </Col>
              </Row>
              <Row>
                <Col span={4} className="label-text">
                  {t("schedule_time")}
                </Col>
                <Col span={16}>
                  {classData.defaultSchedule && classData.defaultSchedule.length
                    ? classData.defaultSchedule.map((item) => {
                        const data = transformSchedule(item);
                        return (
                          <Row>{`${data.dayOfWeek} ${data.startTime} - ${data.endTime}`}</Row>
                        );
                      })
                    : t("not_have_default_schedule")}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col span={12}>
                  {t("number_of_volunteers")}:{" "}
                  {getArrayLength(classData.volunteers)}
                </Col>
                <Col span={12}>
                  {t("number_of_students")}:{" "}
                  {getArrayLength(classData.students)}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  {t("class_monitor")}: {classData.classMonitor?.user.name}
                </Col>
                <Col span={12}>
                  {t("sub_class_monitor")}:{" "}
                  {classData.subClassMonitor?.user.name}
                </Col>
              </Row>
            </>
          )}
          <hr />
          {checkCurrentUserBelongToCurrentClass(currentUserData, id) && (
            <div>
              {checkAdminAndMonitorRole(userRole) && (
                <Row>
                  <div className="class-detail__add-lesson">
                    <Button type="primary">
                      <Link to={`/classes/${id}/lessons/add`}>
                        {t("add_lesson")}
                      </Link>
                    </Button>
                  </div>
                </Row>
              )}
              <LessonList id={id} userId={userId} />
            </div>
          )}
        </div>
        <Modal
          title={t("modal_confirm_delete_class_title")}
          visible={confirmDelete}
          onOk={deleteClass}
          onCancel={cancelDelete}
          okText={t("delete_class")}
          cancelText={t("cancel")}
          footer={[
            <Button onClick={cancelDelete}>{t("cancel")}</Button>,
            <Button onClick={deleteClass} type="danger">
              {t("delete_class")}
            </Button>,
          ]}
        >
          {t("modal_confirm_delete_class_content")}
        </Modal>
      </div>
    </div>
  );
}

export default ClassDetail;
