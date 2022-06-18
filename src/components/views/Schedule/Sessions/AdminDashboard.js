import { Col, Row, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import useFetchAllClasses from "../../../../hook/Class/useFetchAllClasses";
import MyCalendar from "./Calendar";
import Report from "./Report";

const { Option } = Select;

function AdminDashboard(props) {
  const { t } = props;
  const [schedule, setSchedule] = useState([]);
  const [classData, setClassData] = useState();
  const classes = useFetchAllClasses();

  const onSelectClass = (value) => {
    fetchClassschedule({ classId: value });
  };

  useEffect(() => {
    fetchClassschedule({ classId: 0 });
  }, []);

  const fetchClassschedule = async (dataToSend) => {
    const data = await apis.classes.getClassSchedules(dataToSend);
    if (data.success) {
      const classData = data.classData;
      setClassData(classData ? classData : { _id: "0", name: t("all_option") });
      setSchedule(data.schedule);
    }
  };

  return (
    <div>
      <Report t={t} />
      <div className="class-schedule__title">
        {`${t("class_schedule")} ${
          classData && classData.name ? `- ${classData.name}` : ""
        }`}
      </div>
      <Row className="class-schedule__filter">
        <Col span={16}></Col>
        <Col span={8}>
          <Form.Item
            label={t("select_class")}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Select
              value={classData?.name}
              onChange={(value) => onSelectClass(value)}
              showSearch
              placeholder={t("select_class")}
              className="class-schedule__filter-input"
            >
              <Option key="0" value="0">
                {t("all_option")}
              </Option>
              {classes.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {schedule && <MyCalendar data={schedule} />}
    </div>
  );
}

export default AdminDashboard;
