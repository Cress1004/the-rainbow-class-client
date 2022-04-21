import { Tabs } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUnpairedPairs } from "../../../common/function/classFunction";
import { getArrayLength } from "../../../common/transformData";
import ClassBasicInfo from "./Tabs/ClassBasicInfo";
import PairManager from "./Tabs/PairManager";

const { TabPane } = Tabs;

function OneToOneTutoringDetail(props) {
  const { classData, fetchClassData } = props;
  const { t } = useTranslation();
  const unpairedPairs = getUnpairedPairs(classData.pairsTeaching);
  return (
    <div className="class-detail__info-area">
      <Tabs defaultActiveKey="1">
        <TabPane tab={t("basic_infor")} key="1">
          <ClassBasicInfo classData={classData} />
        </TabPane>
        <TabPane
          tab={`${t("pair_manager")} (${getArrayLength(unpairedPairs)}) `}
          key="2"
        >
          <PairManager classData={classData} fetchClassData={fetchClassData} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default OneToOneTutoringDetail;
