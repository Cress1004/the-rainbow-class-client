import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Icon,
  Dropdown,
  Menu,
  DatePicker,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  convertDateStringToMoment,
  transformAddressData,
  transformDate,
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
import {
  FORMAT_DATE,
  STUDENT_STATUS,
  STUDENT_STATUS_TITLE,
} from "../../../../common/constant";

const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const leftLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

function StudentDetail(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [studentData, setStudentData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPopupInputRetiredDate, setShowPopupInputRetiredDate] =
    useState(false);
  const currentUserData = useFetchCurrentUserData();
  const userRole = currentUserData?.userRole;
  const studentStatus = STUDENT_STATUS.find(
    (item) => item.key === studentData?.status
  );

  const formik = useFormik({
    initialValues: {
      studentId: id,
      retirementDate: convertDateStringToMoment(new Date()),
      status: STUDENT_STATUS_TITLE.RETIRED,
    },
    validationSchema: Yup.object({
      retirementDate: Yup.string()
        .required(t("required_retirement_date"))
        .nullable(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        fetchChangeStudentStatus(id, { dataToSend: values });
        setShowPopupInputRetiredDate(false);
        setSubmitting(false);
      }, 400);
    },
  });

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
        birthday: student.birthday ? transformDate(student.birthday) : null,
        admissionDay: student.admissionDay ? transformDate(student.admissionDay) : null,
        retirementDate: transformDate(student.retirementDate),
        status: student.status ? student.status : 0,
        updatedBy: student.updatedBy?.name,
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

  const fetchChangeStudentStatus = async (studentId, dataToSend) => {
    const data = await apis.student.changeStatus(studentId, dataToSend);
    if (data.success) {
      fetchStudentData(studentId);
    } else {
      alert(t("fail_to_change_student_status"));
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

  const checkFillAllData = () => {
    return formik.values.retirementDate;
  };

  const statusMenuList = () => {
    return (
      <Menu>
        <Menu.Item
          key={STUDENT_STATUS[1].key}
          onClick={() => setShowPopupInputRetiredDate(true)}
        >
          {STUDENT_STATUS[1].text}
        </Menu.Item>
      </Menu>
    );
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
      {userRole && checkAdminAndMonitorRole(userRole) ? (
        <Row className="student-detail__action-row">
          <Button
            type="primary"
            className="student-detail__edit-student-button"
          >
            <Link to={`/students/${id}/edit`}>{t("edit_student")}</Link>
          </Button>
          <Button
            type="danger"
            className="student-detail__delete-student-button"
            onClick={openDeletePopup}
          >
            {t("delete_student")}
          </Button>
        </Row>
      ) : null}
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
              {checkAdminAndMonitorRole(userRole) ? (
                <Item className="student-detail__status">
                  {studentStatus.key === STUDENT_STATUS_TITLE.STUDING ? (
                    <div className={`student-detail__status`}>
                      <Dropdown.Button
                        className={`ant-btn--${studentStatus.value}`}
                        overlay={statusMenuList}
                        icon={<Icon type="down" />}
                        trigger={["click"]}
                        disabled={studentStatus.key === STUDENT_STATUS[1].key}
                      >
                        {studentStatus.text}
                      </Dropdown.Button>
                    </div>
                  ) : (
                    <Button className={`ant-btn--${studentStatus.value}`}>
                      {studentStatus.text}
                    </Button>
                  )}
                </Item>
              ) : (
                <Item>
                  {studentStatus.key === STUDENT_STATUS_TITLE.STUDING ? (
                    <Button className={`ant-btn--${studentStatus.value}`}>
                      {studentStatus.text}
                    </Button>
                  ) : (
                    <Button className={`ant-btn--${studentStatus.value}`}>
                      {studentStatus.text}
                    </Button>
                  )}
                </Item>
              )}
              <Form {...leftLayout} className="student-detail__info-area">
                <Item label={t("admission_day")}>
                  {studentData.admissionDay}
                </Item>
                {studentStatus.key === STUDENT_STATUS_TITLE.RETIRED ? (
                  <div>
                    <Item label={t("retirement_date")}>
                      {studentData.retirementDate}
                    </Item>
                    <Item label={t("updated_by")}>{studentData.updatedBy}</Item>
                  </div>
                ) : null}
              </Form>
            </Col>
            <Col className="student-detail__right-block" span={18}>
              <Form {...layout} className="student-detail__info-area">
                <Item label={t("user_name")}>{studentData.name}</Item>
                <Item label={t("email")}>{studentData.email}</Item>
                <Item label={t("phone_number")}>{studentData.phoneNumber}</Item>
                <Item label={t("birthday")}>{studentData.birthday}</Item>
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
      <Modal
        title={t("modal_input_retired_date")}
        visible={showPopupInputRetiredDate}
        onOk={formik.handleSubmit}
        onCancel={() => setShowPopupInputRetiredDate(false)}
        okText={t("submit")}
        cancelText={t("cancel")}
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowPopupInputRetiredDate(false)}
          >
            {t("cancel")}
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={formik.handleSubmit}
            disabled={!checkFillAllData()}
          >
            {t("submit")}
          </Button>,
        ]}
      >
        <Form className="">
          <Item label={t("retired_date")}>
            <DatePicker
              format={FORMAT_DATE}
              defaultValue={formik.values.retirementDate}
              name="retirementDate"
              onChange={(dateString) =>
                formik.setFieldValue("retirementDate", dateString)
              }
              placeholder={t("retirement_date_placeholder")}
            />
          </Item>
        </Form>
      </Modal>
    </div>
  );
}

export default StudentDetail;
