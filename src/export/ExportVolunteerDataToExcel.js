import React from "react";
import { convertRoleName } from "../components/common/function";
import { transformAddressData } from "../components/common/transformData";
import ExportVolunteerCSV from "./Component/ExportVolunteerCSV";

function ExportVolunteerDataToExcel(props) {
  const { t, volunteersData } = props;

  const transformVolunteerData = (data) => {
    return data?.map((item, index) => ({
      key: index,
      userName: item.user.name,
      phoneNumber: `${item.user.phoneNumber}`,
      email: item.user.email,
      address: transformAddressData(item.user.address),
      linkFacebook: item.linkFacebook || "",
      role: convertRoleName(item.role).vie,
      class: item.user.class?.name || "",
    }));
  };

  const data = transformVolunteerData(volunteersData);

  const wscols = [
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.key.toString().length + 1)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.userName.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.phoneNumber.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.email.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.address.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.linkFacebook.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.class.length)
      ),
    },
    {
      wch: Math.max.apply(
        Math,
        data.map((volunteer) => volunteer.role.length)
      ),
    },
  ];

  return (
    <div>
      <ExportVolunteerCSV
        csvData={data}
        fileName={t("volunteers_list")}
        wscols={wscols}
      />
    </div>
  );
}

export default ExportVolunteerDataToExcel;
