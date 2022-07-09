import { Button, Icon, Input, Form, Row, Col } from "antd";
import React from "react";

function AddStudentType(props) {
  const { handleClickBack, t, formik, layout, tailLayout } = props;

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
            {t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddStudentType;
