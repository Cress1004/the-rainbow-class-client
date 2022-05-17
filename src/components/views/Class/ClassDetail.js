import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Button, Modal, Icon, Menu, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { checkAdminAndMonitorRole } from "../../common/function";
import {
  checkCurrentMonitorBelongToCurrentClass,
  checkCurrentVolunteerBelongToCurrentClass,
} from "../../common/checkRole";
import { SUPER_ADMIN } from "../../common/constant";
import PermissionDenied from "../Error/PermissionDenied";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";
import apis from "../../../apis";
import useFetchAllLessonByClass from "../../../hook/Lesson/useFetchAllLessonByClass";
import common from "../../common";
import TeachByClassOptionDetail from "./ClassDetailSessions/TeachByClassOptionDetail";
import OneToOneTutoringDetail from "./ClassDetailSessions/OneToOneTutoringDetail";

function ClassDetail(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData.userRole;
  const [classData, setClassData] = useState({});
  const lessons = useFetchAllLessonByClass(id);
  const [defaultTab, setDefaultTab] = useState(
    localStorage.getItem("defaultTab") || "basic-info"
  );

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const fetchDeleteClass = async (id) => {
    const data = await apis.classes.deleteClass(id);
    if (data.success) {
      alert(t("delete_class_success"));
      history.push("/classes");
    } else {
      alert(t("fail_to_delete_class"));
    }
  };

  const fetchClassData = async (id) => {
    const data = await apis.classes.getClassData(id);
    if (data.success) {
      const classInfo = data.classData;
      setClassData({
        _id: classInfo._id,
        name: classInfo.name,
        description: classInfo.description,
        address: classInfo.address,
        studentTypes: classInfo.studentTypes,
        defaultSchedule: classInfo.defaultSchedule,
        volunteers: classInfo.volunteers,
        classMonitor: classInfo.classMonitor,
        subClassMonitor: classInfo.subClassMonitor,
        students: classInfo.students,
        teachingOption: classInfo.teachingOption,
        pairsTeaching: classInfo.pairsTeaching,
      });
    } else {
      alert(t("fail_to_delete_class"));
    }
  };

  const deleteClass = () => {
    setConfirmDelete(false);
    fetchDeleteClass(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  useEffect(() => {
    fetchClassData(id);
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab")) setDefaultTab(params.get("tab"));
  }, []);

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
          <div className="class-detail__title">{`${t("class_detail")}${
            classData?.name ? ` - ${classData.name}` : ""
          }`}</div>
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
        {classData.teachingOption ===
        common.classConstant.ONE_2_ONE_TUTORING ? (
          <OneToOneTutoringDetail
            classData={classData}
            currentUserData={currentUserData}
            fetchClassData={fetchClassData}
            defaultTab={defaultTab}
          />
        ) : (
          <TeachByClassOptionDetail
            classData={classData}
            currentUserData={currentUserData}
            classId={id}
            userRole={userRole}
            lessons={lessons}
            defaultTab={defaultTab}
            setDefaultTab={setDefaultTab}
          />
        )}
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
