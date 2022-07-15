import { Button, Icon, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import apis from "../../apis";
import { useFormik } from "formik";
import "./upload-cv.scss";
import ModalAddQuestion from "./CVQuestionSessions/ModalAddQuestion";
import QuestionDetail from "./CVQuestionSessions/QuestionDetail";

function CVQuestion(props) {
  const { t } = useTranslation();
  const [addQuestionPopup, setAddQuestionPopup] = useState(false);
  const [questions, setQuestions] = useState([]);

  const cancelModal = () => {
    setAddQuestionPopup(false);
  };

  const checkFillAllData = () => {
    return formik.values.content;
  };

  const fetchAddNewQuestion = async (questionData) => {
    const data = await apis.cvQuestion.addQuestion(questionData);
    if (data.success) {
      setAddQuestionPopup(false);
      resetQuestion();
      message.success("Save question success");
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  const fetchQuestions = async () => {
    const data = await apis.cvQuestion.getQuestions();
    if (data.success) {
      setQuestions(data.questions);
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const formik = useFormik({
    initialValues: {
      content: null,
      isRequired: true,
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        await fetchAddNewQuestion(values);
        await fetchQuestions();
        setSubmitting(false);
      }, 400);
    },
  });

  const resetQuestion = () => {
    formik.setFieldValue("content", "");
  };

  return (
    <div className="cv-question">
      <div className="cv-question__title">{t("cv_question")}</div>
      <Row style={{ textAlign: "right" }}>
        <Button
          type="primary"
          className="cv-question__add-cv-question"
          onClick={() => setAddQuestionPopup(true)}
        >
          <Icon type="plus-circle" /> {t("add_question")}
        </Button>
      </Row>
      {questions?.map((question, index) => (
        <QuestionDetail
          t={t}
          question={question}
          index={index}
          fetchQuestions={fetchQuestions}
        />
      ))}
      <ModalAddQuestion
        t={t}
        formik={formik}
        checkFillAllData={checkFillAllData}
        cancelModal={cancelModal}
        addQuestionPopup={addQuestionPopup}
      />
    </div>
  );
}

export default CVQuestion;
