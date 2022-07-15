import React from "react";
import { useTranslation } from "react-i18next";

function Statistic(props) {
  const { t } = useTranslation();
  return (
    <div className="statistic">
      <div className="statistic__title">{t("statistic")}</div>
      <Tabs
        defaultActiveKey={defaultTab}
        onChange={(key) => handleChangeTab(key)}
      >
        <TabPane tab={t("basic_infor")} key="basic-info">
          <ClassBasicInfo classData={classData} />
        </TabPane>
        {checkAdminAndMonitorRole(currentUserData.userRole) &&
        !isCurrentVolunteerBelongCurrentPair ? (
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
            isAdmin={isAdmin}
            fetchPairDataByVolunteer={fetchPairDataByVolunteer}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Statistic;
