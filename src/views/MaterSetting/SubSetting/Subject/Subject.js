import { Button, Table, Input, message, Icon } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../apis";
import Edit from "../../../../components/custom/action/Edit";
import Delete from "../../../../components/custom/action/Delete";
import BasicModalConfirm from "../../../../components/custom/modal/BasicModalConfirm";
import UpdateSubject from "./UpdateSubject";

function Subject() {
  const { t } = useTranslation();
  const [listParams, setListParams] = useState({ limit: 10 });
  const [deleteItem, setDeleteItem] = useState();
  const [updateItem, setUpdateItem] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [numberOfSubjects, setNumberOfSubjects] = useState(0);
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    const data = await apis.commonData.getSubjectsWithParams(listParams);
    if (data.success) {
      setSubjects(data.subjects);
      setNumberOfSubjects(data.count);
    }
  };

  const fetchAddSubject = async (dataToSend) => {
    const data = await apis.commonData.addSubject(dataToSend);
    if (data.success) {
      fetchSubjects();
      setUpdate(false);
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchUpdateSubject = async (dataToSend) => {
    const data = await apis.commonData.updateSubject(dataToSend);
    if (data.success) {
      await fetchSubjects();
      setUpdate(false);
      setUpdateItem(null);
      message.success("update subject success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchDeleteSubject = async (id) => {
    const data = await apis.commonData.deleteSubject(id);
    if (data.success) {
      fetchSubjects();
      message.success(t("delete success"));
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [listParams]);

  const columns = [
    {
      title: t("subject"),
      dataIndex: "subject",
      key: "subject",
      ellipsis: {
        showTitle: false,
      },
      width: "80%",
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("action"),
      key: "id",
      dataIndex: "id",
      render: (id, subject) => (
        <div className="action-icon">
          <Edit handleClick={() => handleEdit(subject)} />
          <Delete handleClick={() => setShowModalDelete(id)} />
        </div>
      ),
    },
  ];

  const data = subjects?.map((item, index) => ({
    key: index,
    id: item._id,
    subject: item.title,
  }));

  const handleClickAdd = () => {
    setUpdate(true);
    setUpdateItem(null);
  };

  const handleClickBack = () => {
    setUpdate(false);
    setUpdateItem(null);
  };

  const handleDelete = async (id) => {
    await fetchDeleteSubject(id);
  };

  const handleEdit = (studentType) => {
    setUpdate(true);
    setUpdateItem(studentType);
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

  const handleOk = async () => {
    await handleDelete(deleteItem);
    setDeleteItem(null);
    setHideModal();
  };

  const handleChangeSearchInput = (e) => {
    setListParams({ ...listParams, search: e.target.value, offset: 1 });
  };

  const handleChangePagination = (pageNumber) => {
    setListParams({ ...listParams, offset: pageNumber });
  };

  return (
    <div>
      <div className="mastersetting__list--title">{t("subject")}</div>
      {isUpdate ? (
        <UpdateSubject
          handleClickBack={handleClickBack}
          t={t}
          updateItem={updateItem}
          fetchAddSubject={fetchAddSubject}
          fetchUpdateSubject={fetchUpdateSubject}
        />
      ) : (
        <div>
          <div className="tool-flex">
            <Input
              className="input-search"
              prefix={<Icon type="search" />}
              placeholder={t("search")}
              onChange={(e) => handleChangeSearchInput(e)}
            />
            <Button
              onClick={handleClickAdd}
              type="primary"
              className="add-button"
            >
              <Icon type="plus-circle" /> {t("add_new")}
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              total: numberOfSubjects,
              defaultCurrent: listParams.offset,
              onChange: (pageNumber) => handleChangePagination(pageNumber),
              pageSize: listParams.limit,
              title: null,
            }}
          />
        </div>
      )}
      <BasicModalConfirm
        title={t("confirm_delete_subject_title")}
        content={t("confirm_delete_subject_content")}
        handleOk={handleOk}
        handleCancel={handleCancel}
        visible={showModal}
      />
    </div>
  );
}

export default Subject;
