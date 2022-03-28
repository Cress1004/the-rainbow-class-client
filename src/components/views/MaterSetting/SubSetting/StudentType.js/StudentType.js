import { Button, Table, Form, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "../../master-setting.scss";
import apis from "../../../../../apis";

function StudentType() {
  const { t } = useTranslation();
  const key = "updatable";
  const [studentTypes, setStudentTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [add, setAdd] = useState(false);

  const fetchStudentTypes = async () => {
    const data = await apis.commonData.getStudentTypes();
    if (data.success) {
      setStudentTypes(data.studentTypes);
    }
  };

  const fetchAddStudentType = async (dataToSend) => {
    const data = await apis.commonData.addStudentType(dataToSend);
    if (data.success) {
      alert("Success");
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchDeleteStudentType = async (id) => {
    const data = await apis.commonData.deleteStudentType(id);
    if (data.success) {
      fetchStudentTypes();
      alert(t("delete success"));
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchStudentTypes();
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
    fetchDeleteStudentType(id);
  };

  const handleSubmit = async (e) => {
    fetchAddStudentType({ title: newType });
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
