import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button, Icon } from "antd";
import { useTranslation } from "react-i18next";

const ExportStudentCSV = ({ csvData, fileName, wscols }) => {
  const { t } = useTranslation();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const Heading = [
    {
      key: t("No."),
      userName: t("user_name"),
      phoneNumber: t("phone_number"),
      email: t("email"),
      address: t("address"),
      birthday: t("birthday"),
      parentName: t("parent_name"),
      class: t("class"),
      studentTypes: t("student_type"),
      admissionDay: t("admission_day"),
      retirementDate: t("retirement_date"),
      status: t("status"),
    },
  ];
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(Heading, {
      header: [
        "key",
        "userName",
        "phoneNumber",
        "email",
        "address",
        "birthday",
        "parentName",
        "class",
        "studentTypes",
        "admissionDay",
        "retirementDate",
        "status",
      ],
      skipHeader: true,
      origin: 0,
    });
    ws["!cols"] = wscols;
    XLSX.utils.sheet_add_json(ws, csvData, {
      header: [
        "key",
        "userName",
        "phoneNumber",
        "email",
        "address",
        "birthday",
        "parentName",
        "class",
        "studentTypes",
        "admissionDay",
        "retirementDate",
        "status",
      ],
      skipHeader: true,
      origin: -1,
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      variant="warning"
      onClick={(e) => exportToCSV(csvData, fileName, wscols)}
    >
      <Icon type="file-excel" />
      {t("export_students_data_to_excel")}
    </Button>
  );
};

export default ExportStudentCSV;
