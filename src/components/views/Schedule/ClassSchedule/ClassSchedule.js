import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "../schedule.scss";
import MyCalendar from "../Sessions/Calendar";
import { Col, Form, Row, Select } from "antd";
import { STUDENT, SUPER_ADMIN, VOLUNTEER } from "../../../common/constant";
import PermissionDenied from "../../Error/PermissionDenied";

const { Option } = Select;
function ClassSchedule() {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [schedule, setSchedule] = useState([]);
  const [classData, setClassData] = useState();
  const [classes, setClasses] = useState([]);
  const [userRole, setUserRole] = useState({});

  useEffect(() => {
    Axios.post(`/api/users/get-role`, { userId: userId }).then((response) => {
      if (response.data.success) {
        const data = response.data.userRole;
        setUserRole(data);
      } 
    });
    Axios.post(`/api/classes/my-class-schedules`, { userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data;
          setSchedule(data.schedule);
          setClassData(data.classData);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
    Axios.post(`/api/classes/get-all-classes`, null).then((response) => {
      if (response.data.success) {
        setClasses(response.data.classes);
      } 
    });
  }, [t, userId]);

  const onSelectClass = (value) => {
    Axios.post(`/api/classes/get-class-schedules`, { classId: value }).then(
      (response) => {
        if (response.data.success) {
          const classData = response.data.classData;
          setClassData(
            classData ? classData : { _id: "0", name: t("all_option") }
          );
          setSchedule(response.data.schedule);
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  };
  return (
    <div className="class-schedule">
      {userRole.role === STUDENT && <PermissionDenied />}
      {userRole.role === VOLUNTEER && userRole.subRole !== SUPER_ADMIN && (
        <div>
          <div className="class-schedule__title">{`${t("class_schedule")} - ${
            classData && classData.name
          }`}</div>
          {userRole.isAdmin && (
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
          )}
          {schedule && <MyCalendar data={schedule} userId={userId} />}
        </div>
      )}
    </div>
  );
}

export default ClassSchedule;
