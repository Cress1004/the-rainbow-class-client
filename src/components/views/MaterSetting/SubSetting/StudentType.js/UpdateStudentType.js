import { Button, Icon, Input, Form, Row, Col } from "antd";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function UpdateStudentType(props) {
  const {
    handleClickBack,
    t,
    layout,
    tailLayout,
    updateItem,
    fetchAddStudentType,
    fetchUpdateStudentType,
  } = props;
  const formik = useFormik({
    initialValues: {
      id: updateItem ? updateItem.id : undefined,
      newType: updateItem ? updateItem.studentType : undefined,
    },
    validationSchema: Yup.object({
      newType: Yup.string().required(t("required_student_type_message")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        updateItem
          ? await fetchUpdateStudentType({
              id: values.id,
              title: values.newType,
            })
          : await fetchAddStudentType({ title: values.newType });
        await setSubmitting(false);
      }, 400);
    },
  });
  return (
    <div>
      <Row className="mastersetting__close-icon">
        <Col span={23}></Col>
        <Col span={1}>
          {" "}
          <Icon type="close-circle" onClick={handleClickBack} />
        </Col>
      </Row>
      <Form
        onSubmit={formik.handleSubmit}
        {...layout}
        className="mastersetting__form"
      >
        <Form.Item label={t("student_type")} required>
          <Input
            name="newType"
            placeholder={t("input_new_student_type")}
            defaultValue={formik.values.newType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />{" "}
          {formik.errors.name && formik.touched.name && (
            <span className="custom__error-message">
              {formik.errors.newType}
            </span>
          )}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {updateItem ? t("update") : t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdateStudentType;
