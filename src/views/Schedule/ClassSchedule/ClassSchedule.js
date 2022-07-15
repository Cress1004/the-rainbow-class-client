import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../schedule.scss";
import MyCalendar from "../Sessions/Calendar";
import { Col, Form, Row, Select } from "antd";
import { STUDENT, SUPER_ADMIN, VOLUNTEER } from "../../../common/constant";
import PermissionDenied from "../../Error/PermissionDenied";
import apis from "../../../apis";
import useFetchAllClasses from "../../../hook/Class/useFetchAllClasses";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";

const { Option } = Select;
function ClassSchedule() {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [schedule, setSchedule] = useState([]);
  const [classData, setClassData] = useState();
  const classes = useFetchAllClasses();
  const currentUser = useFetchCurrentUserData();
  const userRole = currentUser.userRole;

  const fetchCurrentUserClassSchedule = async () => {
    const data = await apis.classes.getCurrentUserClassSchedule();
    if (data.success) {
      setSchedule(data.schedule);
      setClassData(data.classData);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchClassschedule = async (dataToSend) => {
    const data = await apis.classes.getClassSchedules(dataToSend);
    if (data.success) {
      const classData = data.classData;
      setClassData(classData ? classData : { _id: "0", name: t("all_option") });
      setSchedule(data.schedule);
    }
  };

  useEffect(() => {
    fetchCurrentUserClassSchedule();
  }, []);

  const onSelectClass = (value) => {
    fetchClassschedule({ classId: value });
  };
  return (
    <div className="class-schedule">
      {userRole.role === STUDENT && <PermissionDenied />}
      {userRole.role === VOLUNTEER && userRole.subRole !== SUPER_ADMIN && (
        <div>
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
