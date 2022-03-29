import React, { useState } from "react";
import { Button, Col, Form, Icon, Row, Select } from "antd";
import { useFormik } from "formik";
import Axios from "axios";
import apis from "../../../../../apis";

const { Option } = Select;

function SetPersonInCharge(props) {
  const {
    t,
    participants,
    personInCharge,
    scheduleId,
    fetchLessonData,
    lessonId,
    classId
  } = props;
  const [isEdit, setEdit] = useState(false);
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  const personInchargeName =
    personInCharge && personInCharge.name ? personInCharge.name : t("unset");

  const fetchUpdatePersonInCharge = async (values, classId, lessonId) => {
    const data = await apis.schedules.updatePersonInCharge(values);
    if (data.success) {
      setEdit(false);
      fetchLessonData(classId, lessonId);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      personInChargeId: personInCharge?._id,
      scheduleId: scheduleId,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        fetchUpdatePersonInCharge(values, classId, lessonId);
        setSubmitting(false);
      }, 400);
    },
  });

  const changePersonInCharge = (value) => {
    formik.setFieldValue("personInChargeId", value);
  };

  return (
    <div className="lesson-detail__person-incharge">
      <Form {...layout} onSubmit={formik.handleSubmit}>
        <Form.Item label={t("person_in_charge")} labelAlign="left">
          {isEdit ? (
            <Row>
              <Col span={10}>
                <Select
                  showSearch
                  placeholder={t("select_person_incharge")}
                  style={{ width: "85%" }}
                  onChange={changePersonInCharge}
                >
                  {participants.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={2}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!formik.values.personInChargeId}
                >
                  {t("save")}
                </Button>
              </Col>
              <Col span={2}>
                <Button onClick={() => setEdit(false)}>{t("cancel")}</Button>
              </Col>
            </Row>
          ) : (
            personInchargeName
          )}{" "}
          {!isEdit && <Icon type="edit" onClick={() => setEdit(true)} />}
        </Form.Item>
      </Form>
    </div>
  );
}

export default SetPersonInCharge;
