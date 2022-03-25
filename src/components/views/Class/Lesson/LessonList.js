import React, { useState, useEffect } from "react";
import { Table, Row } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { transformScheduleTimeData } from "../../../common/transformData";
import { OFFLINE_OPTION } from "../../../common/constant";
import Axios from "axios";

function LessonList(props) {
  const { t } = useTranslation();
  const { id, userId } = props;
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    Axios.post(`/api/classes/${id}/get-lessons`, {
      classId: id,
      userId: userId,
    }).then((response) => {
      if (response.data.success) {
        setLessons(response.data.lessons);
      } 
    });
  }, [t, id, userId]);

  const data = lessons
    ? lessons.map((item, index) => ({
        key: index,
        id: item._id,
        title: item.title,
        description: item.description,
        // address: transformAddressData(item.schedule.address),
        teachOption: item.schedule.teachOption,
        time: transformScheduleTimeData(item.schedule.time),
        // classMonitor: item.class_monitor
        //   ? item.class_monitor
        //   : `(${t("unset")})`,
        // targetStudent: transformStudentTypes(item.studentTypes),
        // numberOfStudent: item.students.length,
        personInCharge: item.schedule.personInCharge?.name,
      }))
    : [];

  const columns = [
    {
      title: t("lesson_name"),
      dataIndex: "title",
      key: "title",
      render: (text, key) => renderData(text, key),
      width: 100,
    },
    {
      title: t("person_in_charge"),
      dataIndex: "personInCharge",
      key: "personInCharge",
      width: 120,
      render: (text, key) => renderData(text ? text : t("un_register"), key),
    },
    {
      title: t("time"),
      dataIndex: "time",
      key: "time",
      width: 150,
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("teach_option"),
      dataIndex: "teachOption",
      key: "teachOption",
      width: 75,
      render: (text, key) =>
        renderData(
          text === OFFLINE_OPTION ? t("offline_option") : t("online_option"),
          key
        ),
    },
  ];

  const renderData = (text, key) => (
    <Link
      to={`/classes/${id}/lessons/${key.id}`}
      className={"text-in-table-row"}
    >
      <span>{text}</span>
    </Link>
  );
  return (
    <div className="lesson-list">
      <Row>
        <div className="lesson-list__title">
          {t("lesson_list")} ({`${data.length} ${t("lesson")}`})
        </div>
      </Row>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default LessonList;
