/* eslint-disable react-hooks/exhaustive-deps */
import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../../apis";
import { getMonthRangeBetweenTwoDate } from "../../../common/function/checkTime";
import { getArrayLength } from "../../../common/transformData";

function SemesterReport(props) {
  const { t, semester, classData } = props;
  const [allAchievement, setAllAchievement] = useState([]);
  const [monthList, setMonthList] = useState(null);

  const fetchLessonsAndAchievementBySemester = async (classId, month) => {
    const data = await apis.lessons.getLessonsByClassAndSemester(
      classId,
      month
    );
    if (data.success) {
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

  if (getArrayLength(monthList)) {
    monthList.map((month) => {
      return fixedColumns.push({
        title: month,
        dataIndex: `monthAverage`,
        key: month,
        minWidth: 30,
        maxWidth: 50,
        render: (record) => {
          var currentMonthAcv = record?.find((item) => item.month === month);
          return (
            <div>
              {!isNaN(currentMonthAcv.avgMonth)
                ? currentMonthAcv.avgMonth.toFixed(2)
                : "-"}
            </div>
          );
        },
      });
    });
  }

  const avgByMonthAndStudent = (achievement) => {
    let sumData = [];
    monthList.map((month) => {
      const monthAcv = achievement.filter(
        (acv) =>
          acv.achievement.lesson?.schedule.time.date.slice(0, 7) === month
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
      return null;
    });
    return sumData;
  };

  const avgScore = (avgByMonth) => {
    let sum = 0;
    avgByMonth.forEach((item) => {
      if (!isNaN(item.avgMonth)) sum += item.avgMonth;
    });
    console.log(sum);
    return (sum / getArrayLength(monthList)).toFixed(2);
  };

  let fixedData = [];
  if (getArrayLength(allAchievement)) {
    fixedData = allAchievement?.map((item) => {
      const avgByMonth = avgByMonthAndStudent(item.achievement);
      return {
        key: `${item?._id}`,
        name: item?.student?.user?.name,
        achievement: item?.achievement,
        comment: item?.comment,
        average: avgScore(avgByMonth),
        monthAverage: avgByMonth,
      };
    });
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
