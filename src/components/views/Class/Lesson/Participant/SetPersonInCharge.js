import React, { useState } from "react";
import { Button, Col, Form, Icon, message, Row, Select } from "antd";
import { useFormik } from "formik";
import apis from "../../../../../apis";
import { checkStringContentSubString } from "../../../../common/function";

const { Option } = Select;

function SetPersonInCharge(props) {
  const {
    t,
    participants,
    personInCharge,
    scheduleId,
    fetchLessonData,
    lessonId,
    classId,
  } = props;
  const [isEdit, setEdit] = useState(false);
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const personInchargeName =
    personInCharge && personInCharge.name ? personInCharge.name : t("unset");

  const fetchUpdatePersonInCharge = async (values, classId, lessonId) => {
    const data = await apis.schedules.updatePersonInCharge(values);
    if (data.success) {
      await fetchLessonData(classId, lessonId);
      setEdit(false);
      message.success("save_person_incharge_success");
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("some_thing_went_wrong");
    }
  };

  const formik = useFormik({
    initialValues: {
      personInChargeId: personInCharge?._id,
      scheduleId: scheduleId,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        await fetchUpdatePersonInCharge(values, classId, lessonId);
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
        <Form.Item label={t("person_in_charge")}>
          {isEdit ? (
            <Row>
              <Col span={7}>
                <Select
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    checkStringContentSubString(option.props.children, input)
                  }
                  placeholder={t("select_person_incharge")}
                  style={{ width: "90%" }}
                  onChange={changePersonInCharge}
                  defaultValue={formik.values.personInChargeId}
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
