import React from "react";
import { STUDENT_STATUS } from "../components/common/constant";
import {
  transformAddressData,
  transformDate,
  transformStudentTypes,
} from "../components/common/transformData";
import ExportStudentCSV from "./Component/ExportStudentCSV";

function ExportStudentDataToExcel(props) {
  const { t, studentsData } = props;

  const transformStudentData = (data) => {
    return data?.map((item, index) => ({
      key: index,
      userName: item.user.name,
      phoneNumber: `${item.user.phoneNumber}`,
      email: item.user.email,
      address: transformAddressData(item.user.address),
      birthday: transformDate(item.birthday),
      parentName: item.parentName,
      class: item.user.class?.name || "",
      studentTypes: transformStudentTypes(item.studentTypes),
      admissionDay: transformDate(item.admissionDay),
      retirementDate: transformDate(item.retirementDate),
      status: STUDENT_STATUS.find((sta) => sta.key === item.status),
    }));
  };

  const data = transformStudentData(studentsData);

  const wscols = [
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.key.toString().length + 1)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.userName.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.phoneNumber.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.email.length || 0)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.address?.length || 0)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.birthday?.length || 0)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.parentName.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.class.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.studentTypes.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.admissionDay?.length || 0)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.retirementDate?.length || 0)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((student) => student.status.length)
      ),
    },
  ];

  return (
    <div>
      <ExportStudentCSV
        csvData={data}
        fileName={t("students_list")}
        wscols={wscols}
      />
    </div>
  );
}

export default ExportStudentDataToExcel;
