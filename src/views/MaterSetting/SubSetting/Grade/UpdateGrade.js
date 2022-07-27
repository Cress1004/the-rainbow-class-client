import { Button, Icon, Input, Form, Row, Col } from "antd";
import React from "react";
import { useFormik } from "formik";

function UpdateGrade(props) {
  const { handleClickBack, t, updateItem, fetchAddGrade, fetchUpdateGrade } =
    props;
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };
  const tailLayout = {
    wrapperCol: { offset: 16, span: 4 },
  };
  const formik = useFormik({
    initialValues: {
      id: updateItem ? updateItem.id : undefined,
      newType: updateItem ? updateItem.grade : undefined,
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        updateItem
          ? await fetchUpdateGrade({
              id: values.id,
              title: values.newType,
            })
          : await fetchAddGrade({ title: values.newType });
        await setSubmitting(false);
      }, 400);
    },
  });

  const fieldError = (formik) => {
    return formik.values.newType;
  };

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
        <Form.Item label={t("grade")} required>
          <Input
            name="newType"
            placeholder={t("input_new_grade")}
            defaultValue={formik.values.newType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />{" "}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!fieldError(formik)}
          >
            {updateItem ? t("update") : t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdateGrade;
