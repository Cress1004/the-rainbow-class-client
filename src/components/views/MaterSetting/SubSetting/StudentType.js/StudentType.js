import { Button, Table, message } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../../apis";
import { getArrayLength } from "../../../../common/transformData";
import TableNodata from "../../../NoData/TableNodata";
import AddStudentType from "./AddStudentType";
import { useFormik } from "formik";
import * as Yup from "yup";

function StudentType() {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };
  const { t } = useTranslation();
  const [studentTypes, setStudentTypes] = useState([]);
  const [add, setAdd] = useState(false);
  const formik = useFormik({
    initialValues: {
      newType: "",
    },
    validationSchema: Yup.object({
      newType: Yup.string().required(t("required_student_type_message")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        await fetchAddStudentType({ title: values.newType });
        await setSubmitting(false);
      }, 400);
    },
  });

  const fetchStudentTypes = async () => {
    const data = await apis.commonData.getStudentTypes();
    if (data.success) {
      setStudentTypes(data.studentTypes);
    }
  };

  const fetchAddStudentType = async (dataToSend) => {
    const data = await apis.commonData.addStudentType(dataToSend);
    if (data.success) {
      await fetchStudentTypes();
      setAdd(false);
      message.success("Add student type success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchDeleteStudentType = async (id) => {
    const data = await apis.commonData.deleteStudentType(id);
    if (data.success) {
      await fetchStudentTypes();
      message.success(t("delete student type success"));
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  useEffect(() => {
    fetchStudentTypes();
  }, []);

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

  // const handleSubmit = async (e) => {
  //   fetchAddStudentType({ title: newType });
  // };

  return (
    <div>
      <div className="type-of-student-list__title">{t("student_type")}</div>
      {add ? (
        <AddStudentType
          handleClickBack={handleClickBack}
          layout={layout}
          tailLayout={tailLayout}
          t={t}
          formik={formik}
        />
      ) : (
        <div>
          <Button
            onClick={handleClickAdd}
            type="primary"
            className="add-new-student-type-button"
          >
            {t("add_new_student_type")}
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

export default StudentType;
