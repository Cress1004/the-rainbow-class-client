import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import useFetchStudentByClass from "../../../../hook/Class/useFetchStudentByClass";
import { getArrayLength } from "../../../common/transformData";
import EditCommentModal from "./EditComment/EditCommentModal";
import { checkCurrentVolunteerBelongToCurrentClass } from "../../../common/checkRole";
import PermissionDenied from "../../Error/PermissionDenied";
import "./comment-student.scss";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import useFetchAllLessonByClass from "../../../../hook/Lesson/useFetchAllLessonByClass";

function CommentStudent(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState({});
  const lessonData = useFetchAllLessonByClass(id);
  const studentData = useFetchStudentByClass(id);
  const currentUser = useFetchCurrentUserData();

  const fixedColumns = [
    {
      title: t("student_name"),
      dataIndex: "name",
      fixed: true,
      width: 250,
    },
  ];

  if (getArrayLength(lessonData)) {
    lessonData.map((lesson) => {
      return fixedColumns.push({
        title: lesson.title,
        dataIndex: `achievement`,
        key: lesson._id,
        render: (record) => {
          var currentLesson = record.find((item) => item.lesson === lesson._id);
          return (
            <span onClick={() => editCommentByLesson(lesson)}>
              {currentLesson ? currentLesson.comment : t("no_comment")}
            </span>
          );
        },
      });
    });
  }

  let fixedData = [];
  if (getArrayLength(studentData)) {
    fixedData = studentData.map((item) => ({
      key: `${item.student._id}`,
      name: item.student.user?.name,
      achievement: item.achievement,
    }));
  }

  const editCommentByLesson = (lesson) => {
    setEditing(true);
    setEditingAchievement(lesson);
  };
  if (!checkCurrentVolunteerBelongToCurrentClass(currentUser, id))
    return <PermissionDenied />;
  return (
    <div>
      <div className="comment-student__title">{t("comment_student")}</div>
      <Table
        columns={fixedColumns}
        dataSource={fixedData}
        pagination={false}
        scroll={{ x: 2000, y: 500 }}
        bordered
      />
      {editing ? (
        <EditCommentModal
          t={t}
          studentData={studentData}
          editing={editing}
          setEditing={setEditing}
          editingAchievement={editingAchievement}
        />
      ) : null}
    </div>
  );
}

export default CommentStudent;
