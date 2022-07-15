import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
import useFetchSubjects from "../../../hook/CommonData.js/useFetchSubjects";
import "./report.scss";
import apis from "../../../apis";
const { Option } = Select;
const { TextArea } = Input;

function AddReport(props) {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 16, span: 8 },
  };

  const {
    t,
    pairData,
    lessons,
    currentVolunteerData,
    setAddReport,
    fetchReportsByPair,
    month
  } = props;
  const subjects = useFetchSubjects();

  const fetchAddReport = async (dataToSend) => {
    const data = await apis.reports.addNewReport(dataToSend);
    if (data.success) {
      message.success("Save success");
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Fail to get api");
    }
  };

  const formik = useFormik({
    initialValues: {
      lesson: "",
      student: pairData?.student?._id,
      subject: "",
      lessonDescription: "",
      comment: "",
      point: null,
      volunteer: currentVolunteerData?._id,
      pair: pairData?._id,
      createdBy: currentVolunteerData?._id,
    },
    validationSchema: Yup.object({
      lesson: Yup.string().required(t("required_lesson_message")),
      subject: Yup.string().required(t("required_subject_message")),
      lessonDescription: Yup.string().required(
        t("required_description_message")
      ),
      comment: Yup.string().required(t("required_comment_message")),
      point: Yup.number().required("required_point_message"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        await fetchAddReport(values);
        await fetchReportsByPair(pairData._id, month)
        setAddReport(false);
        setSubmitting(false);
      }, 400);
    },
  });

  const fieldError = (formik) => {
    return (
      !formik.errors.lesson &&
      !formik.errors.subject &&
      !formik.errors.lessonDescription &&
      !formik.errors.comment &&
      !formik.errors.point
    );
  };

  return (
    <div className="add-report">
      <div className="add-report__title">{t("new_report")}</div>
      <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
        <Row>
          <Col span={3}></Col>
          <Col span={10}>
            {" "}
            <Form.Item label={t("student_name")} required>
              {pairData?.student?.user.name}
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label={t("input_point")} required>
              <InputNumber
                onChange={(value) => formik.setFieldValue("point", value)}
                onBlur={formik.onBlur}
                min="0"
                max="10"
              />{" "}
              {t("/10")}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={t("lesson")} required>
          <Select
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "10px",
            }}
            placeholder={t("input_lesson")}
            onChange={(value) => formik.setFieldValue("lesson", value)}
          >
            {lessons?.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
          {formik.errors.lesson && formik.touched.lesson && (
            <span className="custom__error-message">
              {formik.errors.lesson}
            </span>
          )}
        </Form.Item>
        <Form.Item label={t("subject")} required>
          <Select
            // showSearch
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "10px",
            }}
            placeholder={t("select_subject")}
            onChange={(value) => formik.setFieldValue("subject", value)}
          >
            {subjects?.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("lesson_description")} required>
          <TextArea
            className="add-report__note-description"
            name="lessonDescription"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="10"
          ></TextArea>
        </Form.Item>
        <Form.Item label={t("comment_student")} required>
          <TextArea
            className="add-report__note-description"
            name="comment"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="4"
          ></TextArea>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            onClick={() => setAddReport(false)}
            style={{ marginRight: "10px" }}
          >
            {t("cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className={!fieldError(formik) ? "disable-submit-button" : ""}
            disabled={!fieldError(formik)}
          >
            {t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddReport;
