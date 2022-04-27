import { Button } from "antd";
import React, { useState } from "react";
import { checkAdminRole } from "../../../common/checkRole";
import AddReport from "./AddReport";

function ReportList(props) {
  const {
    userRole,
    currentVolunteerData,
    classData,
    pairData,
    lessons,
    isCurrentVolunteerBelongCurrentPair,
    t,
  } = props;
  const [addReport, setAddReport] = useState(false);
  return (
    <div>
      {addReport ? (
        <AddReport
          classData={classData}
          currentVolunteerData={currentVolunteerData}
          pairData={pairData}
          lessons={lessons}
          t={t}
          setAddReport={setAddReport}
        />
      ) : (
        <>
          {" "}
          {isCurrentVolunteerBelongCurrentPair ? (
            <Button
              type="primary"
              className="class-list__add-class-button"
              onClick={() => setAddReport(true)}
            >
              {t("add_report")}
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}

export default ReportList;
