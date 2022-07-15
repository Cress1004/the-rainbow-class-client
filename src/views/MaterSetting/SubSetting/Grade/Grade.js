import { Button, Table, Form, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../apis";
import { getArrayLength } from "../../../../common/transformData";
import TableNodata from "../../../NoData/TableNodata";

function Grade() {
  const { t } = useTranslation();
  const key = "updatable";
  const [grades, setGrades] = useState([]);
  const [newType, setNewType] = useState("");
  const [add, setAdd] = useState(false);

  const fetchGrades = async () => {
    const data = await apis.commonData.getGrades();
    if (data.success) {
      setGrades(data.grades);
    }
  };

  const fetchAddGrade = async (dataToSend) => {
    const data = await apis.commonData.addGrade(dataToSend);
    if (data.success) {
      fetchGrades();
      setAdd(false);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchDeleteGrade = async (id) => {
    const data = await apis.commonData.deleteGrade(id);
    if (data.success) {
      fetchGrades();
      alert(t("delete success"));
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const columns = [
    {
      title: t("grade"),
      dataIndex: "grade",
      key: "grade",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("action"),
      key: "id",
      dataIndex: "id",
      render: (id) => (
        <button onClick={(e) => handleDelete(e, id)}>{t("delete")}</button>
      ),
    },
  ];

  const data = grades.map((item, index) => ({
    key: index,
    id: item._id,
    grade: item.title,
  }));

  const handleClickAdd = () => {
    setAdd(true);
  };

  const handleClickBack = () => {
    setAdd(false);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    fetchDeleteGrade(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchAddGrade({ title: newType });
  };

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

  return (
    <div>
      <div className="type-of-student-list__title">{t("grade")}</div>
      {add ? (
        <div>
          <Button onClick={handleClickBack}>{t("back")}</Button>
          <Form onSubmit={handleSubmit}>
            <Form.Item label={t("grade")} required>
              <Input onChange={(e) => setNewType(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={openMessage}>
                {t("register")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div>
          <Button
            onClick={handleClickAdd}
            type="primary"
            className="add-new-student-type-button"
          >
            {t("add_new_grade")}
          </Button>
          {getArrayLength(data) ? (
            <Table columns={columns} dataSource={data} />
          ) : (
            <TableNodata />
          )}
        </div>
      )}
    </div>
  );
}

export default Grade;
