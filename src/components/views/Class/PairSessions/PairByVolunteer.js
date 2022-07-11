import { Button, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { checkCurrentUserBelongToCurrentClass } from "../../../common/checkRole";
import AddLesson from "../Lesson/AddLesson";
import PairDetail from "./PairDetail";
import PairLessonList from "../Lesson/PairLessonList";
import LessonList from "../Lesson/LessonList";

function PairByVolunteer(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const {
    classData,
    currentUserData,
    fetchLessonsByPair,
    setLessons,
    pairData,
    currentVolunteerData,
    lessons,
  } = props;
  const [addLesson, setAddLesson] = useState(false);

  return (
    <div>
      {addLesson ? (
        <div>
          <AddLesson
            setAddLesson={setAddLesson}
            fetchLessonsByPair={fetchLessonsByPair}
            setLessons={setLessons}
            pairId={pairData._id}
          />
        </div>
      ) : (
        <div>
          {" "}
          <PairDetail pairData={pairData} t={t} />
          {checkCurrentUserBelongToCurrentClass(
            currentUserData,
            classData._id
          ) ? (
            <div>
              {currentVolunteerData.user?._id === userId ? (
                <Row>
                  <div className="class-detail__add-lesson">
                    <Button type="primary" onClick={() => setAddLesson(true)}>
                      {t("add_lesson")}
                    </Button>
                  </div>
                </Row>
              ) : null}
              <LessonList lessons={lessons} classData={classData}/>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default PairByVolunteer;
