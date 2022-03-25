import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import SetPersonInCharge from "./SetPersonInCharge";

function PaticipantList(props) {
  const { t } = useTranslation();
  const { participants, checkAdminAndMonitorRole, personInCharge, scheduleId, fetchLessonData, lessonId, userId } =
    props;
  const data = participants
    ? participants.map((item, index) => ({
        key: index,
        id: item._id,
        name: item.name,
        phoneNumber: item.phoneNumber,
      }))
    : [];

  const columns = [
    {
      title: t("user_name"),
      dataIndex: "name",
      key: "name",
      render: (text, key) => <span>{text}</span>,
      width: 100,
    },
    {
      title: t("phone_number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text, key) => <span>{text}</span>,
    },
  ];

  return (
    <div className="participant-list">
      {checkAdminAndMonitorRole && data.length && (
        <SetPersonInCharge
          t={t}
          participants={data}
          personInCharge={personInCharge}
          scheduleId={scheduleId}
          fetchLessonData={fetchLessonData}
          lessonId={lessonId}
          userId={userId}
        />
      )}
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default PaticipantList;
