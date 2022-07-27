import { Button, Icon, message, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import apis from "../../../apis";
import { transformTime } from "../../../common/transformData";
import Edit from "../../../components/custom/action/Edit";
import Delete from "../../../components/custom/action/Delete";
import BasicModalConfirm from "../../../components/custom/modal/BasicModalConfirm";
import UpdateNote from "./UpdateNote";

function CVNote(props) {
  const { t, cvId } = props;
  const [isUpdate, setUpdate] = useState(false);
  const [updateItem, setUpdateItem] = useState();
  const [notes, setNote] = useState();
  const [showModal, setShowModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState();
  const currentUserId = JSON.parse(localStorage.getItem("userId"));

  const fetchNotes = async () => {
    const data = await apis.cv.getNotes(cvId);
    if (data.success) {
      setNote(transformNotesData(data.notes));
    }
  };

  const fetchAddNote = async (dataToSend) => {
    const data = await apis.cv.addNote(dataToSend);
    if (data.success) {
      await fetchNotes();
      setUpdate(false);
      message.success("add note success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchUpdateNote = async (dataToSend) => {
    const data = await apis.cv.editNote(dataToSend);
    if (data.success) {
      await fetchNotes();
      setUpdate(false);
      message.success("edit note success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchDeleteNote = async (id) => {
    const data = await apis.cv.deleteNote(id);
    if (data.success) {
      await fetchNotes();
      setUpdate(false);
      message.success("delete note success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const handleEdit = (editItem) => {
    setUpdateItem(editItem);
    setUpdate(true);
  };

  const handleAdd = () => {
    setUpdateItem(null);
    setUpdate(true);
  };

  const handleOk = async () => {
    await handleDelete(deleteItem);
    setDeleteItem(null);
    setHideModal();
  };

  const handleDelete = async (id) => {
    await fetchDeleteNote(id);
  };

  const setShowModalDelete = (id) => {
    setDeleteItem(id);
    setShowModal(true);
  };

  const handleCancel = () => {
    setDeleteItem(null);
    setHideModal();
  };

  const setHideModal = () => {
    setShowModal(false);
  };

  const transformNotesData = (notes) => {
    return notes?.map((item, index) => ({
      key: item._id,
      id: item._id,
      createdBy: item.createdBy.name,
      content: item.content,
      createdAt: item.created_at,
      isAuth: item.createdBy._id === currentUserId,
    }));
  };

  const columns = [
    {
      title: t("created_by"),
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text, key) => renderData(text, key),
      width: "22%"
    },
    {
      title: t("content"),
      dataIndex: "content",
      key: "content",
      width: "45%",
      render: (text, key) => renderData(text, key),
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: "20%",
      render: (text, key) => renderData(transformTime(text), key),
    },
    {
      title: t("action"),
      key: "id",
      dataIndex: "id",
      width: "18%",
      render: (id, note) => (
        <div className="action-icon">
          <Edit handleClick={() => handleEdit(note)} disable={!note.isAuth} />
          <Delete
            handleClick={() => setShowModalDelete(id)}
            disable={!note.isAuth}
          />
        </div>
      ),
    },
  ];

  const renderData = (text, key) => <span>{text}</span>;
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <Row style={{ textAlign: "right" }}>
        <Button type="primary" className="add-button" onClick={handleAdd}>
          <Icon type="plus-circle" /> {t("add_note")}
        </Button>
      </Row>
      <Table columns={columns} dataSource={notes} />{" "}
      <BasicModalConfirm
        title={t("confirm_delete_note_title")}
        content={t("confirm_delete_note_content")}
        handleOk={handleOk}
        handleCancel={handleCancel}
        visible={showModal}
      />
      <UpdateNote
        updateItem={updateItem}
        isUpdate={isUpdate}
        cvId={cvId}
        t={t}
        currentUserId={currentUserId}
        fetchUpdateNote={fetchUpdateNote}
        fetchAddNote={fetchAddNote}
        setUpdateItem={setUpdateItem}
        setUpdate={setUpdate}
      />
    </div>
  );
}

export default CVNote;
