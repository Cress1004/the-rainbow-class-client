import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Tabs } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  convertDateStringToMoment,
  transformAddressData,
  transformDate,
  transformStudentTypes,
} from "../../../../common/transformData";
import { checkStudentAndCurrentUserSameClass } from "../../../../common/function";
import PermissionDenied from "../../../Error/PermissionDenied";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import apis from "../../../../../apis";
import {
  STUDENT_STATUS,
  STUDENT_STATUS_TITLE,
} from "../../../../common/constant";
import BasicInfo from "./StudentDescription/BasicInfo";
import Achievement from "./StudentDescription/Achievement";

const { TabPane } = Tabs;
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
        admissionDay: student.admissionDay
          ? transformDate(student.admissionDay)
          : null,
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
      <Tabs
      // defaultActiveKey={}
      // onChange={(key) => handleChangeTab(key)}
      >
        <TabPane tab={t("basic_infor")} key="basic-info">
          <BasicInfo
            studentData={studentData}
            userRole={userRole}
            t={t}
            studentStatus={studentStatus}
            fetchStudentData={fetchStudentData}
            id={id}
            openDeletePopup={openDeletePopup}
            statusMenuList={statusMenuList}
            leftLayout={leftLayout}
            layout={layout}
            currentUserData={currentUserData}
            confirmDelete={confirmDelete}
            deleteStudent={deleteStudent}
            showPopupInputRetiredDate={showPopupInputRetiredDate}
            setShowPopupInputRetiredDate={setShowPopupInputRetiredDate}
            checkFillAllData={checkFillAllData}
            formik={formik}
          />
        </TabPane>
        <TabPane tab={`${t("student_achievement")}`} key="pair-manager_list">
          <Achievement id={id} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default StudentDetail;
