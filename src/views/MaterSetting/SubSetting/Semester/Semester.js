import { Button, Table, message } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../apis";
import AddSemester from "./AddSemester";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getArrayLength,
  transformDate,
} from "../../../../common/transformData";
import TableNodata from "../../../NoData/TableNodata";

function Semester() {
  const { t } = useTranslation();
  const key = "updatable";
  const [semesters, setSemesters] = useState([]);
  const [add, setAdd] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(t("title_required")),
      startDate: Yup.string().required(t("start_date_required")).nullable(),
      endDate: Yup.string().required(t("end_date_required")).nullable(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        fetchAddSemester(values);
        setSubmitting(false);
      }, 400);
    },
  });

  const fetchSemesters = async () => {
    const data = await apis.commonData.getSemesters();
    if (data.success) {
      setSemesters(data.semesters);
    }
  };

  const fetchAddSemester = async (dataToSend) => {
    const data = await apis.commonData.addSemester(dataToSend);
    if (data.success) {
      fetchSemesters();
      setAdd(false);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchDeleteSemester = async (id) => {
    const data = await apis.commonData.deleteSemester(id);
    if (data.success) {
      fetchSemesters();
      alert(t("delete success"));
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const columns = [
    {
      title: t("semester"),
      dataIndex: "semester",
      key: "semester",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("start_date"),
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("end_date"),
      dataIndex: "endDate",
      key: "endDate",
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

  const data = semesters.map((item, index) => ({
    key: index,
    id: item._id,
    semester: item.title,
    startDate: transformDate(item.startDate),
    endDate: transformDate(item.endDate),
  }));

  const handleClickAdd = () => {
    setAdd(true);
  };

  const handleClickBack = () => {
    setAdd(false);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    fetchDeleteSemester(id);
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     fetchAddSemester({ title: newType });
  //   };

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

  return (
    <div>
      <div className="type-of-student-list__title">{t("semester")}</div>
      {add ? (
        <div>
          <Button onClick={handleClickBack}>{t("back")}</Button>
          <AddSemester openMessage={openMessage} t={t} formik={formik} />
        </div>
      ) : (
        <div>
          <Button
            onClick={handleClickAdd}
            type="primary"
            className="add-new-student-type-button"
          >
            {t("add_new_semester")}
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

export default Semester;
