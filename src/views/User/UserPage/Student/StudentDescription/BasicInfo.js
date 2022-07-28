import {
  Button,
  DatePicker,
  Form,
  Modal,
  Row,
  Col,
  Dropdown,
  Icon,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import {
  FORMAT_DATE,
  STUDENT_STATUS,
  STUDENT_STATUS_TITLE,
} from "../../../../../common/constant";
import {
  checkAdminAndMonitorRole,
  checkStudentAndCurrentUserSameClass,
} from "../../../../../common/function";
import Description from "./Description";

const { Item } = Form;

function BasicInfo(props) {
  const {
    studentData,
    userRole,
    t,
    studentStatus,
    id,
    openDeletePopup,
    statusMenuList,
    leftLayout,
    layout,
    currentUserData,
    fetchStudentData,
    confirmDelete,
    deleteStudent,
    showPopupInputRetiredDate,
    setShowPopupInputRetiredDate,
    checkFillAllData,
    cancelDelete,
    formik
  } = props;
  return (
    <div>
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
            <Col className="student-detail__left-block" span={8}>
              <img
                className="student-detail__avatar"
                src={studentData.image}
                alt="user-avatar"
              ></img>
              <h3>{studentData.name}</h3>
              {checkAdminAndMonitorRole(userRole) ? (
                <Item className="student-detail__status">
                  {studentStatus?.key === STUDENT_STATUS_TITLE.STUDING ? (
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
                    <Button className={`ant-btn--${studentStatus?.value}`}>
                      {studentStatus?.text}
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
                  {studentData?.admissionDay}
                </Item>
                {studentStatus?.key === STUDENT_STATUS_TITLE.RETIRED ? (
                  <div>
                    <Item label={t("retirement_date")}>
                      {studentData.retirementDate}
                    </Item>
                    <Item label={t("updated_by")}>{studentData.updatedBy}</Item>
                  </div>
                ) : null}
              </Form>
            </Col>
            <Col className="student-detail__right-block" span={16}>
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

export default BasicInfo;
