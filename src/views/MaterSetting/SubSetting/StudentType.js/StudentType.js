import { Button, Table, message, Input, Icon } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../apis";
import UpdateStudentType from "./UpdateStudentType";
import Edit from "../../../../components/custom/action/Edit";
import Delete from "../../../../components/custom/action/Delete";
import BasicModalConfirm from "../../../../components/custom/modal/BasicModalConfirm";

function StudentType() {
  const { t } = useTranslation();
  const [studentTypes, setStudentTypes] = useState([]);
  const [isUpdate, setUpdate] = useState(false);
  const [updateItem, setUpdateItem] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState();
  const [listParams, setListParams] = useState({ limit: 10 });
  const [numberOfStudentTypes, setNumberOfStudentTypes] = useState(0);


  const fetchStudentTypes = async () => {
    const data = await apis.commonData.getStudentTypesWithParams(listParams);
    if (data.success) {
      setStudentTypes(data.studentTypes);
      setNumberOfStudentTypes(data.count);
    }
  };

  const fetchAddStudentType = async (dataToSend) => {
    const data = await apis.commonData.addStudentType(dataToSend);
    if (data.success) {
      await fetchStudentTypes();
      setUpdate(false);
      message.success("Add student type success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchUpdateStudentType = async (dataToSend) => {
    const data = await apis.commonData.updateStudentType(dataToSend);
    if (data.success) {
      await fetchStudentTypes();
      setUpdate(false);
      setUpdateItem(null);
      message.success("update student type success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchDeleteStudentType = async (id) => {
    const data = await apis.commonData.deleteStudentType(id);
    if (data.success) {
      await fetchStudentTypes();
      message.success(t("delete student type success"));
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  useEffect(() => {
    fetchStudentTypes();
  }, [listParams]);

  const columns = [
    {
      title: t("student_type"),
      dataIndex: "studentType",
      key: "studentType",
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
      render: (id, studentType) => (
        <div className="action-icon">
          <Edit handleClick={() => handleEdit(studentType)} />
          <Delete handleClick={() => setShowModalDelete(id)} />
        </div>
      ),
    },
  ];

  const data = studentTypes.map((item, index) => ({
    key: index,
    id: item._id,
    studentType: item.title,
  }));

  const handleClickAdd = () => {
    setUpdate(true);
    setUpdateItem(null);
  };

  const handleEdit = (studentType) => {
    setUpdate(true);
    setUpdateItem(studentType);
  };

  const handleClickBack = () => {
    setUpdate(false);
    setUpdateItem(null);
  };

  const handleDelete = async (id) => {
    fetchDeleteStudentType(id);
  };

  const handleChangeSearchInput = (e) => {
    setListParams({ ...listParams, search: e.target.value, offset: 1 });
  };

  const handleChangePagination = (pageNumber) => {
    setListParams({ ...listParams, offset: pageNumber });
  };

  const setHideModal = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setDeleteItem(null);
    setHideModal();
  };

  const handleOk = async () => {
    await handleDelete(deleteItem);
    setDeleteItem(null);
    setHideModal();
  };

  const setShowModalDelete = (id) => {
    setDeleteItem(id);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mastersetting__list--title">{t("student_type")}</div>
      {isUpdate ? (
        <UpdateStudentType
          handleClickBack={handleClickBack}
          t={t}
          updateItem={updateItem}
          fetchAddStudentType={fetchAddStudentType}
          fetchUpdateStudentType={fetchUpdateStudentType}
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
              total: numberOfStudentTypes,
              defaultCurrent: listParams.offset,
              onChange: (pageNumber) => handleChangePagination(pageNumber),
              pageSize: listParams.limit,
              title: null,
            }}
          />
        </div>
      )}
      <BasicModalConfirm
        title={t("confirm_delete_student_type_title")}
        content={t("confirm_delete_student_type_content")}
        handleOk={handleOk}
        handleCancel={handleCancel}
        visible={showModal}
      />
    </div>
  );
}

export default StudentType;
