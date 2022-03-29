import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal, Form } from "antd";
import {
  transformAddressData,
  transformStudentTypes,
} from "../../../../common/transformData";
import {
  checkAdminAndMonitorRole,
  checkStudentAndCurrentUserSameClass,
} from "../../../../common/function";
import PermissionDenied from "../../../Error/PermissionDenied";
import Description from "./StudentDescription/Description";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import apis from "../../../../../apis";

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
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData?.userRole;

  const fetchStudentData = async (studentId) => {
    const data = await apis.student.getStudentData(studentId);
    if (data.success) {
      const student = data.studentData;
      setStudentData({
        id: student._id,
        name: student.user.name,
        email: student.user.email,
        gender: student.user.gender,
        parentName: student.parentName,
        studentTypes: transformStudentTypes(student.studentTypes),
        image: student.user.image,
        address: transformAddressData(student.user.address),
        phoneNumber: student.user.phoneNumber,
        className: student.user.class ? student.user.class.name : t("unset"),
        classId: student.user.class?._id,
        overview: student.overview,
        interest: student.interest,
        character: student.character,
      });
    }
  };

  const fetchDeleteStudent = async (studentId) => {
    const data = await apis.student.deleteStudent(studentId);
    if (data.success) {
      alert(t("delete_student_success"));
      history.push("/students");
    } else {
      alert(t("fail_to_delete_student"));
    }
  };

  useEffect(() => {
    fetchStudentData(id);
  }, [id]);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteStudent = () => {
    setConfirmDelete(false);
    fetchDeleteStudent(id);
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
