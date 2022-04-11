import { Tabs } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import ClassBasicInfo from "./Tabs/ClassBasicInfo";
import PairManager from "./Tabs/PairManager";

const {TabPane} = Tabs;

function OneToOneTutoringDetail(props) {
  const { classData } = props;
  const { t } = useTranslation();

  return (
    <div className="class-detail__info-area">
      <Tabs defaultActiveKey="1">
        <TabPane tab={t("basic_infor")} key="1">
          <ClassBasicInfo classData={classData} />
        </TabPane>
        <TabPane tab={t("pair_manager")} key="2">
          <PairManager />
        </TabPane>
      </Tabs>
     </div>
  );
}

export default OneToOneTutoringDetail;
