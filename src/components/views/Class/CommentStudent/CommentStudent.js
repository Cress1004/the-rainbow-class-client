import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import useFetchStudentByClass from "../../../../hook/useFetchStudentByClass";
import useFetchLessonByClass from "../../../../hook/useFetchLessonByClass";
import useFetchRole from "../../../../hook/useFetchRole";
import { getArrayLength } from "../../../common/transformData";
import EditCommentModal from "./EditComment/EditCommentModal";
import { checkCurrentVolunteerBelongToCurrentClass } from "../../../common/checkRole";
import PermissionDenied from "../../Error/PermissionDenied";
import "./comment-student.scss";

function CommentStudent(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [editing, setEditing] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState({});
  const lessonData = useFetchLessonByClass(id);
  const studentData = useFetchStudentByClass(id);
  const currentUser = useFetchRole(userId);

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
      fixedColumns.push({
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
