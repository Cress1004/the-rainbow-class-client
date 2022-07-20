/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../apis";
import MyCalendar from "../Sessions/Calendar";
import Report from "../Sessions/Report";

const { Option } = Select;

function AdminDashboard(props) {
  const { t, userRole, monthRange, setMonthRange, classes } = props;
  const [schedule, setSchedule] = useState([]);
  const [classData, setClassData] = useState();
  const [classId, setClassId] = useState(0);
  
  const onSelectClass = (value) => {
    setClassId(value);
  };

  const fetchClassschedule = async () => {
    const data = await apis.classes.getClassSchedules({classId: classId, monthRange: monthRange});
    if (data.success) {
      const classData = data.classData;
      setClassData(classData ? classData : { _id: "0", name: t("all_option") });
      setSchedule(data.schedule);
    }
  };

  useEffect(() => {
    fetchClassschedule();
  }, [classId, monthRange]);

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
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
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
      {schedule ? (
        <MyCalendar
          data={schedule}
          userRole={userRole}
          t={t}
          monthRange={monthRange}
          setMonthRange={setMonthRange}
          classes={classes}
        />
      ) : null}
    </div>
  );
}

export default AdminDashboard;
