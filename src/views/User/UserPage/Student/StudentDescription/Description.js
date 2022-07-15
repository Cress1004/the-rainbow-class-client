import { Form, Icon, Input, Button, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { checkAdminAndMonitorRole } from "../../../../../common/function";
import apis from "../../../../../apis";
import "../student.scss";

const { Item } = Form;
const { TextArea } = Input;

function Description(props) {
  const { studentData, userRole, fetchStudentData } = props;
  const { t } = useTranslation();
  const [openForm, setOpenForm] = useState(false);

  const fetchUpdateOverview = async (dataToSend) => {
    const data = await apis.student.updateOverview(dataToSend);
    if (data.success) {
      setOpenForm(false);
      fetchStudentData(studentData.id);
    } else if (!data.success) {
      alert(data.message);
    } else {
      alert(t("fail_to_get_api"));
    }
  };

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
        fetchUpdateOverview(values);
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
        <Row className="student-detail__description-button">
          <Button
            type="primary"
            htmlType="submit"
            className="student-detail__description-button--submit"
          >
            {t("update")}
          </Button>
          <Button
            onClick={() => setOpenForm(false)}
            className="student-detail__description-button--cancel"
          >
            {t("cancel")}
          </Button>
        </Row>
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
