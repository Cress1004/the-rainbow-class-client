import { Form, Select, Button } from "antd";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Axios from "axios";
import useFetchClassData from "../../../../hook/useFetchClassData";
import { getArrayLength } from "../../../common/transformData";
const { Option } = Select;

function SetMonitor(props) {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();

  const classData = useFetchClassData(id);
  const volunteers = classData.volunteers;
  const formik = useFormik({
    initialValues: {
      classId: id,
      classMonitor: classData.classMonitor?._id,
      subClassMonitor: classData.subClassMonitor?._id,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        Axios.post(`/api/classes/${id}/set-monitor`, {
          values: values,
        }).then((response) => {
          if (response.data.success) {
            setSubmitting(false);
            history.push(`/classes/${id}`);
          } else if (!response.data.success) {
            alert(response.data.message);
          } else {
            alert(t("fail_to_get_api"));
          }
        });
      }, 400);
    },
  });

  const handleChangeClassMonitor = (value) => {
    formik.setFieldValue("classMonitor", value);
  };

  const handleChangeSubClassMonitor = (value) => {
    formik.setFieldValue("subClassMonitor", value);
  };

  return (
    <div className="set-monitor">
      <div className="set-monitor__title">{t("set_monitor")}</div>
      {getArrayLength(volunteers) && (
        <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
          <Form.Item label={t("class_monitor")} required>
            <Select
              showSearch
              allowClear
              style={{
                display: "inline-block",
                width: "100%",
                marginRight: "10px",
              }}
              value={formik.values.classMonitor}
              onChange={handleChangeClassMonitor}
              placeholder={t("select_class_monitor")}
            >
              {volunteers.map((option) => (
                <Option
                  key={option._id}
                  value={option._id}
                  disabled={option._id === formik.values.subClassMonitor}
                >
                  {option.user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={t("sub_class_monitor")} required>
            <Select
              showSearch
              allowClear
              style={{
                display: "inline-block",
                width: "100%",
                marginRight: "10px",
              }}
              value={formik.values.subClassMonitor}
              placeholder={t("select_sub_class_monitor")}
              onChange={handleChangeSubClassMonitor}
            >
              {volunteers.map((option) => (
                <Option
                  key={option._id}
                  value={option._id}
                  disabled={option._id === formik.values.classMonitor}
                >
                  {option.user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {t("save")}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default SetMonitor;
