import { Input, Form } from "antd";
import React from "react";
import { useFormik } from "formik";
import FormModal from "../../../components/custom/modal/FormModal";

function UpdateNote(props) {
  const {
    updateItem,
    isUpdate,
    cvId,
    currentUserId,
    fetchAddNote,
    fetchUpdateNote,
    t,
    setUpdateItem,
    setUpdate,
  } = props;

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
console.log(updateItem)
  const formik = useFormik({
    initialValues: {
      id: updateItem ? updateItem.id : undefined,
      cv: cvId,
      content: updateItem ? updateItem.content : undefined,
      createdBy: currentUserId,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        console.log(updateItem)
        updateItem ? await fetchUpdateNote(values) : await fetchAddNote(values);
        await setSubmitting(false);
        handleCancelUpdate();
      }, 400);
    },
  });

  const fieldError = (formik) => {
    return formik.values.content;
  };
  const handleCancelUpdate = async () => {
    setUpdate(false);
    setUpdateItem(null);
  };

  const handleOkUpdate = async () => {
    await formik.handleSubmit();
  };

  const formUpdate = (
    <Form
      onSubmit={formik.handleSubmit}
      {...layout}
      className="mastersetting__form"
    >
      <Form.Item label={t("note")} required>
        <Input
          name="content"
          placeholder={t("input_new_note")}
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />{" "}
      </Form.Item>
    </Form>
  );

  return (
    <FormModal
      title={updateItem ? t("update_note") : t("new_note")}
      content={formUpdate}
      handleOk={handleOkUpdate}
      handleCancel={handleCancelUpdate}
      disableOkButton={!fieldError(formik)}
      visible={isUpdate}
      isSubmitting={formik.isSubmitting}
    />
  );
}

export default UpdateNote;
