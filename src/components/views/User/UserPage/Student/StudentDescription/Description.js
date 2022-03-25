import { Form, Icon, Input, Button } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Axios from "axios";
import { checkAdminAndMonitorRole } from "../../../../../common/function";

const { Item } = Form;
const { TextArea } = Input;

function Description(props) {
  const { studentData, userRole, fetchStudentData } = props;
  const { t } = useTranslation();
  const [openForm, setOpenForm] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: studentData.id,
      interest: studentData.interest,
      character: studentData.character,
      overview: studentData.overview,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        Axios.post(`/api/students/${studentData.id}/update-overview`, {
          values: values,
        }).then((response) => {
          if (response.data.success) {
            setOpenForm(false);
            fetchStudentData(studentData.id)
          } else if (!response.data.success) {
            alert(response.data.message);
          } else {
            alert(t("fail_to_save_avatar"));
          }
        });
        setSubmitting(false);
      }, 400);
    },
  });

  const editForm = (
    <div>
      <Form
        className="student-detail__description-area"
        onSubmit={formik.handleSubmit}
      >
        <Item label={t("interest")}>
          <TextArea
            name="interest"
            onChange={formik.handleChange}
            value={formik.values.interest}
          ></TextArea>
        </Item>
        <Item label={t("character")}>
          <TextArea
            name="character"
            onChange={formik.handleChange}
            value={formik.values.character}
          ></TextArea>
        </Item>
        <Item label={t("overview")}>
          <TextArea
            name="overview"
            onChange={formik.handleChange}
            value={formik.values.overview}
          ></TextArea>
        </Item>
        <Button type="primary" htmlType="submit">
          {t("update")}
        </Button>
        {""}
        <Button onClick={() => setOpenForm(false)}>{t("cancel")}</Button>
      </Form>
    </div>
  );

  return (
    <div>
      <div className="student-detail__title">
        {t("description")}{" "}
        {!openForm && checkAdminAndMonitorRole(userRole) ? (
          <Icon type="edit" onClick={() => setOpenForm(true)} />
        ) : null}
      </div>
      {openForm ? (
        editForm
      ) : (
        <Form className="student-detail__description-area">
          <Item label={t("interest")}>
            {studentData.interest ? studentData.interest : t("undescription")}
          </Item>
          <Item label={t("character")}>
            {studentData.character ? studentData.character : t("undescription")}
          </Item>
          <Item label={t("overview")}>
            {studentData.overview ? studentData.overview : t("undescription")}
          </Item>
        </Form>
      )}
    </div>
  );
}

export default Description;
