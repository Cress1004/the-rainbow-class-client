import { Button, DatePicker, Form, Input } from "antd";
import React from "react";
import { FORMAT_DATE } from "../../../../common/constant";

function AddSemester(props) {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const { formik, openMessage, t } = props;

  return (
    <div>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Item label={t("semester_name")} required>
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.title ? (
            <span className="custom__error-message">{formik.errors.title}</span>
          ) : null}
        </Form.Item>
        <Form.Item label={t("start_date")} required>
          <DatePicker
            format={FORMAT_DATE}
            name="startDate"
            value={formik.values.startDate}
            onChange={(dateString) =>
              formik.setFieldValue("startDate", dateString)
            }
            placeholder={t("date_placeholder")}
          />
          {formik.errors.startDate ? (
            <span className="custom__error-message">
              {formik.errors.startDate}
            </span>
          ) : null}
        </Form.Item>
        <Form.Item label={t("start_date")} required>
          <DatePicker
            format={FORMAT_DATE}
            name="endDate"
            value={formik.values.endDate}
            onChange={(dateString) =>
              formik.setFieldValue("endDate", dateString)
            }
            placeholder={t("date_placeholder")}
          />
          {formik.errors.endDate ? (
            <span className="custom__error-message">
              {formik.errors.endDate}
            </span>
          ) : null}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={openMessage}>
            {t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddSemester;
