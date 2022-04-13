import { Col, Divider, Form, Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { ONE_2_ONE_TUTORING } from "../../../../common/classConstant";
import {
  getArrayLength,
  transformAddressData,
  transformSchedule,
  transformStudentTypes,
} from "../../../../common/transformData";
import "../../class-list.scss";

const { Item } = Form;

function ClassBasicInfo(props) {
  const { t } = useTranslation();
  const { classData } = props;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  return (
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
      <Row>
        <Col span={12}>
          {t("number_of_volunteers")}: {getArrayLength(classData.volunteers)}
        </Col>
        <Col span={12}>
          {t("number_of_students")}: {getArrayLength(classData.students)}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          {t("class_monitor")}: {classData.classMonitor?.user.name}
        </Col>
        <Col span={12}>
          {t("sub_class_monitor")}: {classData.subClassMonitor?.user.name}
        </Col>
      </Row>
      <Divider />
    </div>
  );
}

export default ClassBasicInfo;
