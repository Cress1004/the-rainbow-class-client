import { Button, Table, Form, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../apis";
import { getArrayLength } from "../../../../common/transformData";
import TableNodata from "../../../NoData/TableNodata";

function Subject() {
  const { t } = useTranslation();
  const key = "updatable";
  const [subjects, setSubjects] = useState([]);
  const [newType, setNewType] = useState("");
  const [add, setAdd] = useState(false);

  const fetchSubjects = async () => {
    const data = await apis.commonData.getSubjects();
    if (data.success) {
      setSubjects(data.subjects);
    }
  };

  const fetchAddSubject = async (dataToSend) => {
    const data = await apis.commonData.addSubject(dataToSend);
    if (data.success) {
      fetchSubjects();
      setAdd(false);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchDeleteSubject = async (id) => {
    const data = await apis.commonData.deleteSubject(id);
    if (data.success) {
      fetchSubjects();
      alert(t("delete success"));
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const columns = [
    {
      title: t("subject"),
      dataIndex: "subject",
      key: "subject",
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

  const data = subjects.map((item, index) => ({
    key: index,
    id: item._id,
    subject: item.title,
  }));

  const handleClickAdd = () => {
    setAdd(true);
  };

  const handleClickBack = () => {
    setAdd(false);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    fetchDeleteSubject(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchAddSubject({ title: newType });
  };

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

  return (
    <div>
      <div className="type-of-student-list__title">{t("subject")}</div>
      {add ? (
        <div>
          <Button onClick={handleClickBack}>{t("back")}</Button>
          <Form onSubmit={handleSubmit}>
            <Form.Item label={t("subject")} required>
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
            {t("add_new_subject")}
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

export default Subject;
