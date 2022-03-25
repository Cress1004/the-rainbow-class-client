import { Button, Table, Form, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "../../master-setting.scss";

function StudentType() {
  const { t } = useTranslation();
  const key = "updatable";
  const [studentTypes, setStudentTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [add, setAdd] = useState(false);

  useEffect(() => {
    Axios.post("/api/common-data/student-types", null).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } 
    });
  }, [t]);

  const columns = [
    {
      title: t("student_type"),
      dataIndex: "studentType",
      key: "studentType",
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

  const data = studentTypes.map((item, index) => ({
    key: index,
    id: item._id,
    studentType: item.title,
  }));

  const handleClickAdd = () => {
    setAdd(true);
  };

  const handleClickBack = () => {
    setAdd(false);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await Axios.post(
        `/api/common-data/student-types/${id}`,
        { id: id }
      );
      if (response.data.success) {
        setStudentTypes(studentTypes.filter((item) => item._id !== id));
        alert(t("delete success"));
      } else if (!response.data.success) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(t("fail-to-send-data"));
    }
  };

  const handleSubmit = async (e) => {
    const type = { title: newType };
    try {
      const response = await Axios.post(
        "/api/common-data/add-student-type",
        type
      );
      if (response.data.success) {
        alert("Success")
      }
      else if (!response.data.success) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(t("fail-to-send-data"));
    }
  };

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

  return (
    <div>
      <div className="type-of-student-list__title">{t("student_type")}</div>
      {add ? (
        <div>
          <Button onClick={handleClickBack}>{t("back")}</Button>
          <Form onSubmit={handleSubmit}>
            <Form.Item
              label={t("student_type")}
              rules={[
                {
                  required: true,
                  validateMessages: t("required-student-type"),
                },
              ]}
            >
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
            {t("add_new_student_type")}
          </Button>
          <Table columns={columns} dataSource={data} />
        </div>
      )}
    </div>
  );
}

export default StudentType;
