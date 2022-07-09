import { Col, Input } from "antd";
import { DatePicker } from "antd";
import { TimePicker } from "antd";
import { Modal } from "antd";
import { Button } from "antd";
import { Select } from "antd";
import { Form } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FORMAT_TIME_SCHEDULE } from "../../../common/constant";
import FreeTimeTable from "./FreeTimeTable";
import "../upload-cv.scss";
import apis from "../../../../apis";

const { Item } = Form;
const { Option } = Select;

function SetInterviewTime(props) {
  const {
    t,
    confirmInterview,
    setConfirmInterview,
    formik,
    columns,
    fixedData,
    interviewData,
    classId,
    linkOnline
  } = props;

  const [adminAndCurrentMonitor, setAdminAndCurrentMonitor] = useState([]);

  const fetchAdminAndMonitor = async (classId) => {
    const data = await apis.classes.getAdminMonitor(classId);
    if (data.success) {
      setAdminAndCurrentMonitor(data.data);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchAdminAndMonitor(classId);
  }, [classId]);

  const cancelModal = () => {
    setConfirmInterview(false);
  };

  const checkFillAllData = () => {
    return (
      formik.values.date &&
      formik.values.endTime &&
      formik.values.startTime &&
      formik.values.participants &&
      formik.values.linkOnline
    );
  };

  const onChangeDate = (date, dateString) => {
    formik.setFieldValue("date", dateString);
  };

  const onChangeStartTime = (time, timeString) => {
    formik.setFieldValue("startTime", timeString);
  };

  const onChangeEndTime = (time, timeString) => {
    formik.setFieldValue("endTime", timeString);
  };

  const onChangeParticipants = (value) => {
    formik.setFieldValue("participants", value);
  };

  const onChangeLinkOnline = (e) => {
    formik.setFieldValue("linkOnline", e.target.value);
  };

  const participantsList = adminAndCurrentMonitor?.map((item) => (
    <Option key={item.user._id}>{item.user.name}</Option>
  ));

  return (
    <Modal
      className="set-interview-time-modal"
      title={t("set_interview_time")}
      visible={confirmInterview}
      onOk={formik.handleSubmit}
      onCancel={cancelModal}
      width="60%"
      footer={[
        <Button key="cancel" onClick={cancelModal}>
          {t("cancel")}
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={formik.handleSubmit}
          disabled={!checkFillAllData()}
        >
          {t("ok")}
        </Button>,
      ]}
    >
      <Form className="set-interview-form">
        <Item label={t("input_interview_time")}>
          <Col span={8}>
            <DatePicker
              onChange={onChangeDate}
              placeholder={t("date_placeholder")}
              defaultValue={
                interviewData ? moment(interviewData.time?.date) : undefined
              }
            />
          </Col>
          <Col span={2}>{t("from")}</Col>
          <Col span={5}>
            <TimePicker
              format={FORMAT_TIME_SCHEDULE}
              placeholder={t("time_placeholder")}
              onChange={onChangeStartTime}
              defaultValue={
                interviewData
                  ? moment(interviewData.time?.startTime, FORMAT_TIME_SCHEDULE)
                  : undefined
              }
            />
          </Col>
          <Col span={2}>{t("to")}</Col>
          <Col span={5}>
            <TimePicker
              format={FORMAT_TIME_SCHEDULE}
              placeholder={t("time_placeholder")}
              onChange={onChangeEndTime}
              defaultValue={
                interviewData
                  ? moment(interviewData.time?.endTime, FORMAT_TIME_SCHEDULE)
                  : undefined
              }
            />
          </Col>
        </Item>
        <Item label={t("link_interview")}>
          <Input
            onChange={onChangeLinkOnline}
            placeholder={t("link_interview_placeholder")}
            defaultValue={linkOnline || undefined}
          />
        </Item>
        <Item label={t("person_in_charge")}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder={t("select_person_in_charge")}
            defaultValue={
              formik.values.participants
            }
            onChange={onChangeParticipants}
          >
            {participantsList}
          </Select>
        </Item>
        <Item label={t("applier_free_time")}>
          <FreeTimeTable t={t} columns={columns} fixedData={fixedData} />
        </Item>
      </Form>
    </Modal>
  );
}

export default SetInterviewTime;
