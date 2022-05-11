import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button, Icon } from "antd";
import { useTranslation } from "react-i18next";

const ExportVolunteerCSV = ({ csvData, fileName, wscols }) => {
  const { t } = useTranslation();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const Heading = [
    {
      key: "STT",
      user_name: "Họ và tên",
      phone_number: "Số điện thoại",
      email: "Email",
      address: "Address",
      linkFacebook: "Link Facebook",
      class: "Lớp",
      role: "Chức vụ",
    },
  ];
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(Heading, {
      header: [
        "key",
        "user_name",
        "phone_number",
        "email",
        "address",
        "linkFacebook",
        "class",
        "role",
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
        "linkFacebook",
        "class",
        "role",
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
      <Icon style={{color: "green"}} type="file-excel" />
      {t("export_volunteers_data_to_excel")}
    </Button>
  );
};

export default ExportVolunteerCSV;
