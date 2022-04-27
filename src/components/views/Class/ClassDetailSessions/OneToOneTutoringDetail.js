import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  checkCurrentVolunteerWithCurrentPair,
  getUnpairedPairs,
} from "../../../common/function/classFunction";
import { getArrayLength } from "../../../common/transformData";
import ClassBasicInfo from "./Tabs/ClassBasicInfo";
import PairList from "../PairSessions/PairList";
import PairByVolunteer from "../PairSessions/PairByVolunteer";
import { checkAdminAndMonitorRole } from "../../../common/function";
import ReportList from "../Report/ReportList";
import apis from "../../../../apis";
import _function from "../../../common/function";

const { TabPane } = Tabs;

function OneToOneTutoringDetail(props) {
  const { classData, fetchClassData, currentUserData } = props;
  const { t } = useTranslation();
  const [pairData, setPairData] = useState({});
  const [currentVolunteerData, setCurrentVolunteerData] = useState({});
  const [lessons, setLessons] = useState([]);
  const unpairedPairs = getUnpairedPairs(classData.pairsTeaching);

  const fetchCurrentVolunteerData = async () => {
    const data = await apis.volunteer.getCurrentVolunteer();
    if (data.success) {
      setCurrentVolunteerData(data.volunteerData);
    } else {
      alert(t("fail_to_get_class"));
    }
  };

  const fetchPairDataByVolunteer = async (classId, volunteerId) => {
    const data = await apis.classes.getPairByVolunteer(classId, volunteerId);
    if (data.success) {
      setPairData(data.pairData);
    } else {
      alert(t("fail_to_get_class"));
    }
  };

  const fetchLessonsByPair = async (pairId) => {
    const data = await apis.pairs.getLessonsByPair(pairId);
    if (data.success) {
      setLessons(data.lessons);
    } else {
      alert(t("fail_to_get_class"));
    }
  };

  useEffect(() => {
    fetchCurrentVolunteerData();
    return () => {
      setPairData({});
      setLessons([]);
    };
  }, []);

  useEffect(() => {
    fetchPairDataByVolunteer(classData._id, currentVolunteerData._id);
    return () => {
      setLessons([]);
    };
  }, [classData, currentVolunteerData]);

  useEffect(() => {
    fetchLessonsByPair(pairData._id);
  }, [pairData]);

  const isCurrentVolunteerBelongCurrentPair =
    checkCurrentVolunteerWithCurrentPair(
      pairData?.volunteer?._id,
      currentVolunteerData?._id
    );

  return (
    <div className="class-detail__info-area">
      <Tabs defaultActiveKey="basic-info">
        <TabPane tab={t("basic_infor")} key="basic-info">
          <ClassBasicInfo classData={classData} />
        </TabPane>
        {checkAdminAndMonitorRole(currentUserData.userRole) &&
        isCurrentVolunteerBelongCurrentPair ? (
          <TabPane
            tab={`${t("pair_manager_list")} (${getArrayLength(
              unpairedPairs
            )}) `}
            key="pair-manager_list"
          >
            <PairList classData={classData} fetchClassData={fetchClassData} />
          </TabPane>
        ) : (
          <TabPane tab={`${t("pair_manager")}`} key="pair-manager">
            <PairByVolunteer
              classData={classData}
              currentUserData={currentUserData}
              fetchLessonsByPair={fetchLessonsByPair}
              setLessons={setLessons}
              pairData={pairData}
              currentVolunteerData={currentVolunteerData}
              lessons={lessons}
            />
          </TabPane>
        )}
        <TabPane tab={t("report")} key="report">
          <ReportList
            classData={classData}
            currentUserData={currentUserData}
            isCurrentVolunteerBelongCurrentPair={
              isCurrentVolunteerBelongCurrentPair
            }
            t={t}
            pairData={pairData}
            lessons={lessons}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default OneToOneTutoringDetail;
