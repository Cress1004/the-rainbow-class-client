import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
} from "antd";
import React, { useState } from "react";
import { useFormik } from "formik";
import apis from "../../../../apis";

const { Item } = Form;
const { TextArea } = Input;

function QuestionDetail(props) {
  const { t, question, index, fetchQuestions } = props;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const [editting, setEditting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const checkFillAllData = () => {
    return formik.values.content;
  };

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteQuestion = async () => {
    setConfirmDelete(false);
    await fetchDeleteQuestion(question._id);
    await fetchQuestions();
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const fetchDeleteQuestion = async (questionId) => {
    const data = await apis.cvQuestion.deleteQuestion(questionId);
    if (data.success) {
      setConfirmDelete(false);
      message.success("delete question success");
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  const fetchEditQuestion = async (questionData) => {
    const data = await apis.cvQuestion.editQuestion(questionData);
    if (data.success) {
      setEditting(false);
      message.success("Edit question success");
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  const formik = useFormik({
    initialValues: {
      _id: question._id,
      content: question.content,
      isRequired: question.isRequired,
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        await fetchEditQuestion(values);
        await fetchQuestions();
        setSubmitting(false);
      }, 400);
    },
  });

  return (
    <div>
      <Row>
        <Col
          span={question.isRequired ? 4 : 5}
          className="cv-question__question-detail--subtitle"
        >
          {`${t("question_number")} ${index + 1} 
          ${
            editting
              ? ""
              : `${
                  !question.isRequired
                    ? t("note_not_required")
                    : t("note_required")
                }`
          }`}
        </Col>
        {editting ? (
          <></>
        ) : (
          <>
            {" "}
            <Col span={1}>
              <Icon
                type="edit"
                onClick={() => setEditting(true)}
                style={{ marginRight: "15px" }}
              />
              <Icon
                type="delete"
                style={{ color: "red" }}
                onClick={() => openDeletePopup()}
              />
            </Col>
          </>
        )}
      </Row>
      <div style={{ marginTop: "15px" }}>
        {editting ? (
          <Form
            {...layout}
            className="cv-question__add-question-form"
            onSubmit={formik.handleSubmit}
          >
            <Item label={t("is_required")}>
              <Checkbox
                name="isRequired"
                text={"is_required"}
                checked={formik.values.isRequired}
                onChange={(e) =>
                  formik.setFieldValue("isRequired", e.target.checked)
                }
              />
            </Item>
            <Item label={t("question_content")}>
              <TextArea
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
              />
            </Item>
            <div className="cv-question__question-detail--action">
              <Button
                onClick={() => setEditting(false)}
                style={{ marginRight: "5px" }}
              >
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={!checkFillAllData() ? "disable-submit-button" : ""}
                disabled={!checkFillAllData()}
              >
                {t("update")}
              </Button>
            </div>
          </Form>
        ) : (
          <span>{question.content}</span>
        )}
      </div>
      <Divider />
      <Modal
        title={t("modal_confirm_delete_question")}
        visible={confirmDelete}
        onOk={deleteQuestion}
        onCancel={cancelDelete}
        okText={t("delete_question")}
        cancelText={t("cancel")}
        footer={[
          <Button onClick={cancelDelete}>{t("cancel")}</Button>,
          <Button onClick={deleteQuestion} type="danger">
            {t("delete_question")}
          </Button>,
        ]}
      >
        {t("modal_confirm_delete_question_content")}
      </Modal>
    </div>
  );
}

export default QuestionDetail;
