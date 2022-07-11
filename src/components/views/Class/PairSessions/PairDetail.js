import { Col, Divider, Form, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import apis from "../../../../apis";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import { checkAdminRole } from "../../../common/checkRole";
import { ONE_2_ONE_TUTORING } from "../../../common/classConstant";
import { OFFLINE_OPTION } from "../../../common/constant";
import { checkAdminAndMonitorRole } from "../../../common/function";
import {
  transformAddressData,
  transformSubjects,
} from "../../../common/transformData";
import LessonList from "../Lesson/LessonList";
import "./pair.scss";

const { Item } = Form;

function PairDetail(props) {
  // const { pairData, t, currentUserData } = props;
  const { t } = useTranslation();
  const { id, pairId } = useParams();
  const classData = { _id: id };
  const currentUserData = useFetchCurrentUserData();
  const [pairData, setPairData] = useState();
  const [lessons, setLessons] = useState([]);

  const fetchPairData = async () => {
    const data = await apis.pairs.getPairById(pairId);
    if (data.success) {
      setPairData(data.pairData);
    } else {
      message.error("fail to fetch data");
    }
  };

  const fetchLessonsByPair = async () => {
    const data = await apis.pairs.getLessonsByPair(pairId);
    if (data.success) {
      setLessons(data.lessons);
    } else {
      message.error("fail to fetch data");
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    fetchPairData();
    fetchLessonsByPair();
  }, [pairId]);

  if (!checkAdminAndMonitorRole(currentUserData?.userRole)) {
    return (
      <div>
        Bạn chưa được ghép cặp với học sinh, hãy liên hệ với Cán sự lớp và Quản
        trị viên để được ghép.
      </div>
    );
  }

  return (
    <div className="pair-detail">
      <Col
        span={24}
        className="pair-detail__title"
        style={{ display: "inline" }}
      >
        {t("pair_detail")}
      </Col>
      <Form {...layout}>
        <Col span={12}>
          {" "}
          <Item label={t("student_name")}>{pairData?.student?.user.name}</Item>
          <Item label={t("volunteer_incharge")}>
            {pairData?.volunteer?.user.name}
          </Item>
          <Item label={t("grade")}>{pairData?.grade?.title}</Item>
          <Item label={t("subject")}>
            {transformSubjects(pairData?.subjects)}
          </Item>
        </Col>
        <Col span={12}>
          <Item label={t("number_of_lessons_per_week")}>
            {pairData?.numberOfLessonsPerWeek} {t("lessons_per_week")}
          </Item>
          <Item label={t("teach_option")}>
            {pairData?.teachOption === OFFLINE_OPTION
              ? t("offline")
              : t("online")}
          </Item>
          {pairData?.teachOption === OFFLINE_OPTION ? (
            <Item label={t("address")}>
              {transformAddressData(pairData.address)}
            </Item>
          ) : null}
          <Item label={t("note")}>{pairData?.note || t("no_comment")}</Item>
        </Col>
      </Form>
      <Divider />
      <LessonList lessons={lessons} classData={classData}/>
    </div>
  );
}

export default PairDetail;
