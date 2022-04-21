import { Button, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import apis from "../../../../apis";
import { checkCurrentUserBelongToCurrentClass } from "../../../common/checkRole";
import AddLesson from "../Lesson/AddLesson";
import PairDetail from "./PairDetail";
import PairLessonList from "../Lesson/PairLessonList";

function PairByVolunteer(props) {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const { classData, currentUserData } = props;
  const [lessons, setLessons] = useState([]);
  const [pairData, setPairData] = useState({});
  const [addLesson, setAddLesson] = useState(false);
  const [currentVolunteerData, setCurrentVolunteerData] = useState({});

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
              <PairLessonList lessons={lessons} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default PairByVolunteer;
