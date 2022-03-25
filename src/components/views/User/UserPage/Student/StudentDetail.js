import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal, Form } from "antd";
import {
  transformAddressData,
  transformStudentTypes,
} from "../../../../common/transformData";
import Axios from "axios";
import useFetchRole from "../../../../../hook/useFetchRole";
import {
  checkAdminAndMonitorRole,
  checkStudentAndCurrentUserSameClass,
} from "../../../../common/function";
import PermissionDenied from "../../../Error/PermissionDenied";
import Description from "./StudentDescription/Description";

const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function StudentDetail(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [studentData, setStudentData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const userId = localStorage.getItem("userId");
  const currentUserData = useFetchRole(userId);
  const userRole = currentUserData?.userRole;

  const fetchStudentData = (studentId) => {
    Axios.post(`/api/students/${id}`, { studentId: studentId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data.studentData;
          setStudentData({
            id: data._id,
            name: data.user.name,
            email: data.user.email,
            gender: data.user.gender,
            parentName: data.parentName,
            studentTypes: transformStudentTypes(data.studentTypes),
            image: data.user.image,
            address: transformAddressData(data.user.address),
            phoneNumber: data.user.phoneNumber,
            className: data.user.class ? data.user.class.name : t("unset"),
            classId: data.user.class?._id,
            overview: data.overview,
            interest: data.interest,
            character: data.character,
          });
        }
      }
    );
  };

  useEffect(() => {
    fetchStudentData(id);
  }, [t, id]);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteStudent = () => {
    setConfirmDelete(false);
    Axios.post(`/api/students/${id}/delete`, { studentId: id }).then(
      (response) => {
        if (response.data.success) {
          alert(t("delete_student_success"));
          history.push("/students");
        } else {
          alert(t("fail_to_delete_student"));
        }
      }
    );
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  if (
    studentData &&
    currentUserData &&
    !checkStudentAndCurrentUserSameClass(studentData, currentUserData)
  ) {
    return <PermissionDenied />;
  }

  return (
    <div className="student-detail">
      <div className="student-detail__title">{t("student_detail")}</div>
      {userRole && checkAdminAndMonitorRole(userRole) && (
        <Row>
          <Col span={14} />
          <Col span={6}>
            <Button type="primary" className="edit-student-button">
              <Link to={`/students/${id}/edit`}>{t("edit_student")}</Link>
            </Button>
          </Col>
          <Col span={4}>
            <Button
              type="danger"
              className="delete-student-button"
              onClick={openDeletePopup}
            >
              {t("delete_student")}
            </Button>
          </Col>
        </Row>
      )}
      {studentData && (
        <>
          <Row>
            <Col className="student-detail__left-block" span={6}>
              <img
                className="student-detail__avatar"
                src={studentData.image}
                alt="user-avatar"
              ></img>
              <h3>{studentData.name}</h3>
            </Col>
            <Col className="student-detail__right-block" span={18}>
              <Form {...layout} className="student-detail__info-area">
                <Item label={t("user_name")}>{studentData.name}</Item>
                <Item label={t("email")}>{studentData.email}</Item>
                <Item label={t("phone_number")}>{studentData.phoneNumber}</Item>
                <Item label={t("parent_name")}>{studentData.parentName}</Item>
                <Item label={t("address")}>{studentData.address}</Item>
                <Item label={t("student_types")}>
                  {studentData.studentTypes}
                </Item>
                <Item label={t("class_name")}>{studentData.className}</Item>
              </Form>
            </Col>
          </Row>
          <hr />
          {checkStudentAndCurrentUserSameClass(
            studentData,
            currentUserData
          ) && (
            <Description
              studentData={studentData}
              userRole={userRole}
              fetchStudentData={fetchStudentData}
            />
          )}
        </>
      )}
      <Modal
        title={t("modal_confirm_delete_student_title")}
        visible={confirmDelete}
        onOk={deleteStudent}
        onCancel={cancelDelete}
        okText={t("delete_student")}
        cancelText={t("cancel")}
        footer={[
          <Button onClick={cancelDelete}>{t("cancel")}</Button>,
          <Button onClick={deleteStudent} type="danger">
            {t("delete_student")}
          </Button>,
        ]}
      >
        {t("modal_confirm_delete_student_content")}
      </Modal>
    </div>
  );
}

export default StudentDetail;
