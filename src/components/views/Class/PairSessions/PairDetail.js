import { Col, Divider, Form } from "antd";
import React from "react";
import { OFFLINE_OPTION } from "../../../common/constant";
import {
  transformAddressData,
  transformSubjects,
} from "../../../common/transformData";

const { Item } = Form;

function PairDetail(props) {
  const { pairData, t } = props;

  if (!pairData) {
    return (
      <div>
        Bạn chưa được ghép cặp với học sinh, hãy liên hệ với Cán sự lớp và Quản
        trị viên để được ghép.
      </div>
    );
  }
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <div>
      <Form {...layout} className="class-detail">
        <Col span={12}>
          {" "}
          <Item label={t("student_name")}>{pairData.student?.user.name}</Item>
          <Item label={t("volunteer_incharge")}>
            {pairData.volunteer?.user.name}
          </Item>
          <Item label={t("grade")}>{pairData.grade?.title}</Item>
          <Item label={t("subject")}>
            {transformSubjects(pairData.subjects)}
          </Item>
        </Col>
        <Col span={12}>
          <Item label={t("number_of_lessons_per_week")}>
            {pairData.numberOfLessonsPerWeek} {t("lessons_per_week")}
          </Item>
          <Item label={t("teach_option")}>
            {pairData.teachOption === OFFLINE_OPTION
              ? t("offline")
              : t("online")}
          </Item>
          {pairData.teachOption === OFFLINE_OPTION ? (
            <Item label={t("address")}>
              {transformAddressData(pairData.address)}
            </Item>
          ) : null}
          <Item label="note">{pairData.note}</Item>
        </Col>
      </Form>
      <Divider />
    </div>
  );
}

export default PairDetail;
