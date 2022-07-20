import { Col, Divider, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import apis from "../../../apis";
import { OFFLINE_OPTION } from "../../../common/constant";
import { checkAdminAndMonitorRole, getCurrentUserUserData } from "../../../common/function";
import {
  transformAddressData,
  transformSubjects,
} from "../../../common/transformData";
import LessonList from "../Lesson/LessonList";
import "./pair.scss";

const { Item } = Form;

function PairDetail(props) {
  const { pairIdByVolunteer } = props;
  const { t } = useTranslation();
  const { id, pairId } = useParams();
  const classData = { _id: id };
  const currentUserData = getCurrentUserUserData();
  const [pairData, setPairData] = useState();
  const [lessons, setLessons] = useState([]);

  const fetchPairData = async () => {
    const data = await apis.pairs.getPairById(
      pairId ? pairId : pairIdByVolunteer
    );
    if (data.success) {
      setPairData(data.pairData);
    } else {
      message.error("fail to fetch data");
    }
  };

  const fetchLessonsByPair = async () => {
    const data = await apis.pairs.getLessonsByPair(
      pairId ? pairId : pairIdByVolunteer
    );
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
    if (pairId) fetchLessonsByPair();
  }, [pairId]);

  if (
    !checkAdminAndMonitorRole(currentUserData?.userRole) &&
    pairData?.volunteer?.user?._id.toString() !== localStorage.getItem("userId")
  ) {
    return (
      <div>
        Bạn chưa được ghép cặp với học sinh, hãy liên hệ với Cán sự lớp và Quản
        trị viên để được ghép.
      </div>
    );
  }

  return (
    <div className="pair-detail">
      <Col className="pair-detail__title" style={{ display: "inline" }}>
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
      {pairId ? <LessonList lessons={lessons} classData={classData} /> : null}
    </div>
  );
}

export default PairDetail;
