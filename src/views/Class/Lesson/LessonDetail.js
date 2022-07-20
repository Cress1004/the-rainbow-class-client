import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Dropdown, Icon, Menu, Button, Modal, Form, message } from "antd";
import {
  getArrayLength,
  transformAddressData,
  transformScheduleTimeData,
} from "../../../common/transformData";
import { OFFLINE_OPTION, STUDENT } from "../../../common/constant";
import ParticipantList from "./Participant/ParticipantList";
import { checkCurrentUserBelongToCurrentClass } from "../../../common/checkRole";
import PermissionDenied from "../../../components/custom/Error/PermissionDenied";
import { checkAdminAndMonitorRole, getCurrentUserUserData } from "../../../common/function";
import {
  checkOverTimeToRegister,
  checkUserCanUnRegisterAction,
} from "../../../common/checkCondition";
import apis from "../../../apis";

const { Item } = Form;

function LessonDetail(props) {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const { id, lessonId } = useParams();
  const history = useHistory();
  const [lessonData, setLessonData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [assign, setAssign] = useState(false);
  const currentUser = getCurrentUserUserData();
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
        participants: data.schedule.participants,
        personInCharge: data.schedule.personInCharge,
        pairTeaching: data.pairTeaching,
        class: data.class,
      });
      data.schedule.participants.find(
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
      message.success(t("delete_lesson_success"));
      history.push(
        `${
          !lessonData.pairTeaching._id ||
          (!checkAdminAndMonitorRole(userRole) && lessonData.pairTeaching._id)
            ? `/classes/${classId}/`
            : `/classes/${classId}/pairs/${lessonData.pairTeaching._id}`
        }`
      );
    }
  };

  const fetchAssignSchedule = async (classId, lessonId, scheduleId) => {
    const data = await apis.lessons.assignSchedule(
      classId,
      lessonId,
      scheduleId
    );
    if (data.success) {
      await fetchLessonData(id, lessonId);
      setAssign(true);
      message.success("assign_lesson_success");
    } else {
      message.error(data);
    }
  };

  const fetchUnassignSchedule = async (classId, lessonId, scheduleId) => {
    const data = await apis.lessons.unassignSchedule(
      classId,
      lessonId,
      scheduleId
    );
    if (data.success) {
      await fetchLessonData(id, lessonId);
      setAssign(false);
      message.success("assign_lesson_success");
    } else {
      message.error(data);
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
        {(checkAdminAndMonitorRole(userRole) && !lessonData.pairTeaching) ||
        (checkCurrentUserBelongToCurrentClass(currentUser, lessonData.class) &&
          lessonData.pairTeaching) ? (
          <div className="lesson-detail__more-option">
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement={"bottomLeft"}
            >
              <a
                href={() => false}
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <Icon type="more" />
              </a>
            </Dropdown>
          </div>
        ) : null}
      </Row>
      <div className="lesson-detail__info-area">
        {" "}
        {lessonData && (
          <Form {...layout} className="class-detail">
            <Item label={t("lesson_name")}>{lessonData.title}</Item>
            <Item label={t("description")}>{lessonData.description}</Item>
            <Item label={t("teach_option")}>
              {" "}
              {lessonData.teachOption === OFFLINE_OPTION ? (
                <>
                  {t("offline")}
                  <br />
                  {lessonData.address}
                </>
              ) : (
                <>
                  {t("online")}
                  <br />
                  <a href={lessonData.linkOnline}>{lessonData.linkOnline}</a>
                </>
              )}
            </Item>
            <Item label={t("schedule_time")}>{lessonData.time}</Item>
            {lessonData.pairTeaching ? null : (
              <div>
                <hr />
                <Row>
                  <div className="lesson-detail__participant-list-title">
                    {`${t("participants")} (${getArrayLength(
                      lessonData.participants
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
                          disabled={checkOverTimeToRegister(lessonData.date, 3)}
                        >
                          {t("assign_this_schedule")}
                        </Button>
                      )}
                    </div>
                  )}
                </Row>
                {getArrayLength(lessonData.participants) ? (
                  <ParticipantList
                    participants={lessonData.participants}
                    checkAdminAndMonitorRole={checkAdminAndMonitorRole(
                      userRole
                    )}
                    personInCharge={lessonData.personInCharge}
                    scheduleId={lessonData.scheduleId}
                    fetchLessonData={fetchLessonData}
                    lessonId={lessonId}
                    classId={id}
                  />
                ) : null}
              </div>
            )}
          </Form>
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
