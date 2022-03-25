import React, { useState } from "react";
import { Button, Col, Form, Icon, Row, Select } from "antd";
import { useFormik } from "formik";
import Axios from "axios";

const { Option } = Select;

function SetPersonInCharge(props) {
  const { t, participants, personInCharge, scheduleId, fetchLessonData, lessonId, userId } = props;
  const [isEdit, setEdit] = useState(false);
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  const personInchargeName =
    personInCharge && personInCharge.name ? personInCharge.name : t("unset");

  const formik = useFormik({
    initialValues: {
      personInChargeId: personInCharge?._id,
      scheduleId: scheduleId,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        Axios.post(`/api/schedule/${scheduleId}/update-person-incharge`, {
          values: values,
        }).then((response) => {
          if (response.data.success) {
            setEdit(false);
            fetchLessonData(lessonId, userId)
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
