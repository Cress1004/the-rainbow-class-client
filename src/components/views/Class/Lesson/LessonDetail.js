import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Dropdown, Icon, Col, Menu, Button, Modal } from "antd";
import {
  getArrayLength,
  transformAddressData,
  transformScheduleTimeData,
} from "../../../common/transformData";
import { OFFLINE_OPTION, STUDENT } from "../../../common/constant";
import PaticipantList from "./Paticipant/PaticipantList";
import { checkCurrentUserBelongToCurrentClass } from "../../../common/checkRole";
import PermissionDenied from "../../Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../common/function";
import {
  checkOverTimeToRegister,
  checkUserCanUnRegisterAction,
} from "../../../common/checkCondition";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import apis from "../../../../apis";

function LessonDetail(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const { id, lessonId } = useParams();
  const history = useHistory();
  const [lessonData, setLessonData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [assign, setAssign] = useState(false);
  const currentUser = useFetchCurrentUserData();
  const userRole = currentUser.userRole;

  const fetchLessonData = async (classId, lessonId) => {
    const responseData = await apis.lessons.getLessonData(classId, lessonId);
    if (responseData.success) {
      const data = responseData.lessonData;
      setLessonData({
        scheduleId: data.schedule._id,
        teachOption: data.schedule.teachOption,
        linkOnline: data.schedule.linkOnline,
        title: data.title,
        description: data.description,
        address: transformAddressData(data.schedule.address),
        time: transformScheduleTimeData(data.schedule.time),
        date: new Date(data.schedule.time.date),
        paticipants: data.schedule.paticipants,
        personInCharge: data.schedule.personInCharge,
      });
      data.schedule.paticipants.find(
        (participant) => participant._id === userId
      )
        ? setAssign(true)
        : setAssign(false);
    } else if (!responseData.success) {
      alert(responseData.message);
    }
  };

  const fetchDeleteLesson = async (classId, lessonId) => {
    const data = await apis.lessons.deleteLesson(classId, lessonId);
    if (data.success) {
      alert(t("delete_lesson_success"));
      history.push(`/classes/${classId}/`);
    }
  };

  const fetchAssignSchedule = async (classId, lessonId, scheduleId) => {
    const data = await apis.lessons.assignSchedule(
      classId,
      lessonId,
      scheduleId
    );
    if (data.success) {
      setAssign(true);
      fetchLessonData(id, lessonId);
    }
  };

  const fetchUnassignSchedule = async (classId, lessonId, scheduleId) => {
    const data = await apis.lessons.unassignSchedule(
      classId,
      lessonId,
      scheduleId
    );
    if (data.success) {
      setAssign(false);
      fetchLessonData(id, lessonId);
    }
  };

  useEffect(() => {
    fetchLessonData(id, lessonId);
  }, [id, lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteLesson = () => {
    setConfirmDelete(false);
    fetchDeleteLesson(id, lessonId);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const assignSchedule = () => {
    fetchAssignSchedule(id, lessonId, lessonData.scheduleId);
  };

  const unassignSchedule = () => {
    fetchUnassignSchedule(id, lessonId, lessonData.scheduleId);
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`/classes/${id}/lessons/${lessonId}/edit`}>
          {t("edit_lesson")}
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        className="lesson-detail__delete-lesson"
        onClick={openDeletePopup}
      >
        {t("delete_lesson")}
      </Menu.Item>
    </Menu>
  );

  if (!checkCurrentUserBelongToCurrentClass(currentUser, id)) {
    return <PermissionDenied />;
  }

  const disableUnRegisterButton = !checkUserCanUnRegisterAction(
    userId,
    lessonData.personInCharge?._id,
    lessonData.date
  );

  return (
    <div className="lesson-detail">
      <Row>
        <div className="lesson-detail__title">{t("lesson_detail")}</div>
        {checkAdminAndMonitorRole(userRole) && (
          <div className="lesson-detail__more-option">
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
      <div className="lesson-detail__info-area">
        {" "}
        {lessonData && (
          <>
            <Row>
              <Col span={4} className="label-text">
                {t("lesson_name")}
              </Col>
              <Col span={16}>{lessonData.title}</Col>
            </Row>
            <Row>
              <Col span={4} className="label-text">
                {t("description")}
              </Col>
              <Col span={16}>{lessonData.description}</Col>
            </Row>
            <Row>
              <Col span={4} className="label-text">
                {t("teach_option")}
              </Col>{" "}
              {lessonData.teachOption === OFFLINE_OPTION ? (
                <Col span={16}>
                  <Row>{t("offline")}</Row>
                  <Row>{lessonData.address}</Row>
                </Col>
              ) : (
                <Col span={16}>
                  <Row>{t("online")}</Row>
                  <Row>
                    <a href={lessonData.linkOnline}>{lessonData.linkOnline}</a>
                  </Row>
                </Col>
              )}
            </Row>
            <Row>
              <Col span={4} className="label-text">
                {t("schedule_time")}
              </Col>
              <Col span={16}>{lessonData.time}</Col>
            </Row>
            <hr />
            <Row>
              <div className="lesson-detail__paticipant-list-title">
                {`${t("paticipants")} (${getArrayLength(
                  lessonData.paticipants
                )})`}
              </div>
              {userRole && userRole.role !== STUDENT && (
                <div className="lesson-detail__assign-button">
                  {assign ? (
                    <Button
                      onClick={unassignSchedule}
                      disabled={disableUnRegisterButton}
                    >
                      {t("unassign_this_schedule")}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={assignSchedule}
                      disabled={checkOverTimeToRegister(lessonData.date)}
                    >
                      {t("assign_this_schedule")}
                    </Button>
                  )}
                </div>
              )}
            </Row>
            {getArrayLength(lessonData.paticipants) ? (
              <PaticipantList
                participants={lessonData.paticipants}
                checkAdminAndMonitorRole={checkAdminAndMonitorRole(userRole)}
                personInCharge={lessonData.personInCharge}
                scheduleId={lessonData.scheduleId}
                fetchLessonData={fetchLessonData}
                lessonId={lessonId}
                classId={id}
              />
            ) : null}
          </>
        )}
      </div>
      <Modal
        title={t("modal_confirm_delete_lesson_title")}
        visible={confirmDelete}
        onOk={deleteLesson}
        onCancel={cancelDelete}
        okText={t("delete_lesson")}
        cancelText={t("cancel")}
        footer={[
          <Button onClick={cancelDelete}>{t("cancel")}</Button>,
          <Button onClick={deleteLesson} type="danger">
            {t("delete_lesson")}
          </Button>,
        ]}
      >
        {t("modal_confirm_delete_lesson_content")}
      </Modal>
    </div>
  );
}

export default LessonDetail;
