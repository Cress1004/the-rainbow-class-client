import { Button, Icon, Input, Form, Row, Col, DatePicker } from "antd";
import React from "react";
import { useFormik } from "formik";
import { convertDateStringToMoment } from "../../../../common/transformData";

function UpdateSemester(props) {
  const {
    handleClickBack,
    t,
    updateItem,
    fetchAddSemester,
    fetchUpdateSemester,
  } = props;
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
      title: updateItem ? updateItem.title : undefined,
      startDate: updateItem ? updateItem.startDate : undefined,
      endDate: updateItem ? updateItem.endDate : undefined,
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        updateItem
          ? await fetchUpdateSemester({
              id: values.id,
              title: values.title,
              startDate: values.startDate,
              endDate: values.endDate,
            })
          : await fetchAddSemester({
              title: values.title,
              startDate: values.startDate,
              endDate: values.endDate,
            });
        await setSubmitting(false);
      }, 400);
    },
  });

  const fieldError = (formik) => {
    return (
      formik.values.title && formik.values.startDate && formik.values.endDate
    );
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
        <Form.Item label={t("semester")} required>
          <Input
            name="title"
            placeholder={t("input_new_semester")}
            defaultValue={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item label={t("time")} required>
          <DatePicker
            name="startDate"
            placeholder={"date_placeholder"}
            defaultValue={convertDateStringToMoment(formik.values.startDate)}
            onChange={(e, dateString) =>
              formik.setFieldValue("startDate", dateString)
            }
            onBlur={formik.handleBlur}
            style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          />
          <span
            style={{
              display: "inline-block",
              width: "24px",
              lineHeight: "32px",
              textAlign: "center",
            }}
          >
            -
          </span>
          <DatePicker
            name="endDate"
            placeholder={"date_placeholder"}
            defaultValue={convertDateStringToMoment(formik.values.endDate)}
            onChange={(e, dateString) =>
              formik.setFieldValue("endDate", dateString)
            }
            onBlur={formik.handleBlur}
            style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          />
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

export default UpdateSemester;
