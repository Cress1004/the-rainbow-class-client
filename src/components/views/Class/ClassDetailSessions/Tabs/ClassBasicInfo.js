import { Col, Divider, Form, Icon, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ONE_2_ONE_TUTORING } from "../../../../common/classConstant";
import {
  getArrayLength,
  transformAddressData,
  transformSchedule,
  transformStudentTypes,
} from "../../../../common/transformData";
import StudentListByClass from "../../../User/UserPage/Student/StudentListByClass";
import VolunteerListByClass from "../../../User/UserPage/Volunteer/VolunteerListByClass";
import "../../class-list.scss";

const { Item } = Form;

function ClassBasicInfo(props) {
  const { t } = useTranslation();
  const { classData } = props;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const [showDetailInfo, setShowDetailInfo] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [showStudents, setShowStudents] = useState(false);

  return (
    <div>
      <div className="class-detail__subtitle">
        {t("basic_infor")}
        <Icon
          type={showDetailInfo ? "down-circle" : "right-circle"}
          onClick={() => setShowDetailInfo(!showDetailInfo)}
          className="class-detail__show-icon"
        />
      </div>
      {showDetailInfo ? (
        <div>
          <Form {...layout} className="class-detail">
            <Item label={t("class_name")}>{classData.name}</Item>
            <Item label={t("description")}>{classData.description}</Item>
            <Item label={t("target_student")}>
              {transformStudentTypes(classData.studentTypes)}
            </Item>
            <Item label={t("address")}>
              {transformAddressData(classData.address)}
            </Item>
            {classData.teachingOption !== ONE_2_ONE_TUTORING ? (
              <Item label={t("schedule_time")}>
                {" "}
                {classData.defaultSchedule && classData.defaultSchedule.length
                  ? classData.defaultSchedule.map((item) => {
                      const data = transformSchedule(item);
                      return (
                        <Row>{`${data.dayOfWeek} ${data.startTime} - ${data.endTime}`}</Row>
                      );
                    })
                  : t("not_have_default_schedule")}
              </Item>
            ) : null}
          </Form>
          <Divider />
          <Row style={{ textAlign: "center" }}>
            <Col span={12}>
              {t("class_monitor")}: {classData.classMonitor?.user.name}
            </Col>
            <Col span={12}>
              {t("sub_class_monitor")}: {classData.subClassMonitor?.user.name}
            </Col>
          </Row>
        </div>
      ) : null}
      <Divider />
      <div className="class-detail__subtitle">
        {t("volunteer")}{" "}
        {`${classData.volunteers ? getArrayLength(classData.volunteers) : 0}`}
        <Icon
          type={showVolunteers ? "down-circle" : "right-circle"}
          onClick={() => setShowVolunteers(!showVolunteers)}
          className="class-detail__show-icon"
        />
      </div>
      {showVolunteers ? (
        <VolunteerListByClass volunteersData={classData.volunteers} />
      ) : null}
      <Divider />
      <div className="class-detail__subtitle">
        {t("student")}{" "}
        {`${classData.students ? getArrayLength(classData.students) : 0}`}
        <Icon
          type={showStudents ? "down-circle" : "right-circle"}
          onClick={() => setShowStudents(!showStudents)}
          className="class-detail__show-icon"
        />
      </div>
      {showStudents ? (
        <StudentListByClass studentsData={classData.students} />
      ) : null}
    </div>
  );
}

export default ClassBasicInfo;
