import { Input, Modal, Table } from "antd";
import Axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { getArrayLength } from "../../../../common/transformData";
import "../comment-student.scss";

function EditCommentModal(props) {
  const { t, studentData, editing, setEditing, editingAchievement } = props;

  const formik = useFormik({
    initialValues: {
      lessonId: editingAchievement._id,
      commentData: [],
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        Axios.post("/api/classes/comment-student", values).then((response) => {
          if (response.data.success) {
            window.location.reload();
            setEditing(false);
          } else if (!response.data.success) {
            alert(response.data.message);
          } else {
            alert(t("fail_to_get_api"));
          }
        });
        setSubmitting(false);
      }, 400);
    },
  });

  const handleChangeComment = (e, data) => {
    let index;
    let allRecord = formik.values.commentData;

    if (allRecord.length) {
      index = allRecord.findIndex((item) => item.studentId === data.id);
      if (index != -1) {
        allRecord[index].comment = e.target.value;
      } else {
        allRecord.push({ studentId: data.id, comment: e.target.value });
      }
    } else {
      allRecord.push({ studentId: data.id, comment: e.target.value });
    }
    formik.setFieldValue("commentData", allRecord);
  };

  const fixedColumns = [
    {
      title: t("student_name"),
      dataIndex: "name",
      width: 250,
    },
    {
      title: t("input_comment"),
      dataIndex: "comment",
      render: (text, record) => (
        <Input
          defaultValue={record?.achievement?.comment}
          onChange={(e) => handleChangeComment(e, record)}
        ></Input>
      ),
    },
  ];

  let fixedData = [];
  if (getArrayLength(studentData)) {
    fixedData = studentData.map((data) => ({
      key: `${data.student._id}`,
      name: data.student.user?.name,
      id: data.student._id,
      achievement: data.achievement.find(
        (item) => item.lesson === editingAchievement._id
      ),
    }));
  }

  return (
    <>
      {editingAchievement._id && (
        <Modal
          className="edit-comment-modal"
          title={`input_comment_for_${editingAchievement?.title}`}
          visible={editing}
          onOk={formik.handleSubmit}
          onCancel={() => setEditing(false)}
          width="70%"
        >
          <Table
            columns={fixedColumns}
            dataSource={fixedData}
            pagination={false}
            scroll={{ x: 950, y: 500 }}
            bordered
          />
        </Modal>
      )}
    </>
  );
}

export default EditCommentModal;
