import { Button, Checkbox, Form, Input, Modal } from "antd";
import React from "react";
const { Item } = Form;
const { TextArea } = Input;

function ModalAddQuestion(props) {
    const {t, addQuestionPopup, formik, cancelModal, checkFillAllData} = props;
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      };
  return (
    <div>
      <Modal
        title={t("add_new_question")}
        visible={addQuestionPopup}
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
        <Form {...layout} className="cv-question__add-question-form">
          <Item label={t("question_content")}>
            <TextArea
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
            />
          </Item>
          <Item label={t("isRequired")}>
            <Checkbox
              name="isRequired"
              text={"is_required"}
              checked={formik.values.isRequired}
              onChange={(e) =>
                formik.setFieldValue("isRequired", e.target.checked)
              }
            />
          </Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalAddQuestion;
