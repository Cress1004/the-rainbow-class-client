import { Icon, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import apis from "../../../../../apis";

function PairManager(props) {
  const { classData } = props;
  const { t } = useTranslation();

  const dataSource = classData.pairsTeaching
    ? classData.pairsTeaching.map((item, index) => ({
        key: index,
        id: item._id,
        studentName: item.student.user.name,
        volunteerName: item.volunteer?.user.name,
      }))
    : [];

  const columns = [
    {
      title: t("student_name"),
      dataIndex: "studentName",
      key: "studentName",
      render: (text) => <span>{text}</span>,
      width: 150,
    },
    {
      title: t("volunteer_incharge"),
      dataIndex: "volunteerName",
      key: "volunteerName",
      render: (text) => <span>{text || t("unset")}</span>,
      width: 150,
    },
    {
        title: t("number_of_lessons"),
        dataIndex: "numberOfLessons",
        key: "numberOfLessons",
        render: (text) => <span>{text || 0}</span>,
        width: 150,
      },    
      {
        title: t("teach_option"),
        dataIndex: "teachOption",
        key: "teachOption",
        render: (text) => <span>{text}</span>,
        width: 300,
      },   
    {
      title: t("action"),
      dataIndex: "id",
      key: "id",
      render: (key) => (
        <span>
          <Icon type="eye" />
        </span>
      ),
      width: 150,
    },
  ];

  return (
    <div className="pairs-table">
      <Row>
        <div className="pair-table__title">{t("pair_table")}</div>
      </Row>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}

export default PairManager;
