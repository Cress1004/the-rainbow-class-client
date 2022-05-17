import { message, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import { getMonthRangeBetweenTwoDate } from "../../../common/function/checkTime";
import { getArrayLength, transformDate } from "../../../common/transformData";

function SemesterReport(props) {
  const { t, semester, classData, transfromLessonDetail } = props;
  const [monthReports, setMonthReports] = useState([]);
  const [allAchievement, setAllAchievement] = useState([]);
  const [monthList, setMonthList] = useState(null);

  const fetchLessonsAndAchievementBySemester = async (classId, month) => {
    const data = await apis.lessons.getLessonsByClassAndSemester(
      classId,
      month
    );
    if (data.success) {
      setMonthReports(data.lessonsWithReport);
      setAllAchievement(data.allAchievement);
    } else {
      message.error("Error!");
    }
  };

  const getAchievementBySemester = async () => {
    const monthRange = getMonthRangeBetweenTwoDate(
      semester?.startDate,
      semester?.endDate
    );
    fetchLessonsAndAchievementBySemester(classData?._id, monthRange);
  };

  const fixedColumns = [
    {
      title: t("student_name"),
      dataIndex: "name",
      fixed: true,
      width: 250,
    },
    {
      title: t("average"),
      dataIndex: "average",
      fixed: true,
      width: 100,
    },
  ];

  if (getArrayLength(monthReports)) {
    monthReports.map((lesson) => {
      fixedColumns.push({
        title: (
          <Popover content={transfromLessonDetail(lesson.lesson)}>
            {transformDate(lesson.lesson.schedule.time.date)}
            {/* <br />
            <div className="report-list__show-comment-button">
              <Button onClick={() => handleShowComment(lesson.lesson)}>
                <Icon type="plus-circle" />
              </Button>
            </div> */}
          </Popover>
        ),
        dataIndex: `achievement`,
        key: lesson.lesson._id,
        minWidth: 30,
        maxWidth: 70,
        render: (record) => {
          var currentLesson = record?.find(
            (item) => item?.achievement?.lesson?._id === lesson.lesson._id
          );
          return (
            <div>
              {currentLesson ? (
                <div>
                  <span>
                    {currentLesson ? currentLesson.achievement.point : "-"}
                  </span>
                </div>
              ) : (
                <span>
                  {currentLesson ? currentLesson.achievement.point : "-"}
                </span>
              )}
            </div>
          );
        },
      });
    });
  }

  const avgScoreByMonth = allAchievement?.map((item) => {
    const currentStudent = item.student;
    const achievement = item.achievement;
    let sumData = [];
    monthList.map((month) => {
      const monthAcv = achievement.find(
        (acv) => acv.lesson?.schedule.time.date.slice(0, 7) === month
      );
      var sumMonth = 0;
      if (getArrayLength(monthAcv)) {
        monthAcv.forEach((item) => {
          sumMonth += item.achievement.point;
        });
      }
      sumData.push({
        month: month,
        avgMonth: sumMonth / getArrayLength(monthAcv),
      });
    });
    return sumData;
  });

  console.log(avgScoreByMonth);

  const avgScore = (achievementArray) => {
    let sum = 0;
    achievementArray.forEach((item) => {
      sum += item.achievement.point;
    });
    return (sum / getArrayLength(achievementArray)).toFixed(2);
  };

  let fixedData = [];
  if (getArrayLength(allAchievement)) {
    fixedData = allAchievement?.map((item) => ({
      key: `${item?._id}`,
      name: item?.student?.user?.name,
      achievement: item?.achievement,
      comment: item?.comment,
      average: getArrayLength(item?.achievement)
        ? avgScore(item.achievement)
        : "-",
    }));
  }

  useEffect(() => {
    getAchievementBySemester();
  }, [semester, classData]);

  useEffect(() => {
    setMonthList(
      getMonthRangeBetweenTwoDate(semester?.startDate, semester?.endDate)
    );
  }, [semester]);

  return (
    <div>
      {" "}
      <Table
        className="report-list__all-achievement-table"
        columns={getArrayLength(fixedData) > 0 ? fixedColumns : []}
        dataSource={fixedData}
        pagination={false}
        scroll={{ x: 1000, y: 500 }}
        bordered
      />
    </div>
  );
}

export default SemesterReport;
