import { Tabs } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUnpairedPairs } from "../../../common/function/classFunction";
import { getArrayLength } from "../../../common/transformData";
import ClassBasicInfo from "./Tabs/ClassBasicInfo";
import PairList from "../PairSessions/PairList";
import PairByVolunteer from "../PairSessions/PairByVolunteer";
import { checkAdminAndMonitorRole } from "../../../common/function";

const { TabPane } = Tabs;

function OneToOneTutoringDetail(props) {
  const { classData, fetchClassData, currentUserData } = props;
  const { t } = useTranslation();
  const unpairedPairs = getUnpairedPairs(classData.pairsTeaching);

  return (
    <div className="class-detail__info-area">
      <Tabs defaultActiveKey="basic-info">
        <TabPane tab={t("basic_infor")} key="basic-info">
          <ClassBasicInfo classData={classData} />
        </TabPane>
        {checkAdminAndMonitorRole(currentUserData.userRole) ? (
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
            />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
}

export default OneToOneTutoringDetail;
