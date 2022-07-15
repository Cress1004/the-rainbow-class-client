import { Button, Table, Form, Input, message, Icon } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../apis";
import Edit from "../../../../components/custom/action/Edit";
import Delete from "../../../../components/custom/action/Delete";
import BasicModalConfirm from "../../../../components/custom/modal/BasicModalConfirm";
import UpdateGrade from "./UpdateGrade";

function Grade() {
  const { t } = useTranslation();
  const [listParams, setListParams] = useState({ limit: 10 });
  const [deleteItem, setDeleteItem] = useState();
  const [updateItem, setUpdateItem] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [numberOfGrades, setNumberOfGrades] = useState(0);
  const [grades, setGrades] = useState([]);

  const fetchGrades = async () => {
    const data = await apis.commonData.getGradesWithParams(listParams);
    if (data.success) {
      setGrades(data.grades);
      setNumberOfGrades(data.count);
    }
  };

  const fetchAddGrade = async (dataToSend) => {
    const data = await apis.commonData.addGrade(dataToSend);
    if (data.success) {
      fetchGrades();
      setUpdate(false);
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchUpdateGrade = async (dataToSend) => {
    const data = await apis.commonData.updateGrade(dataToSend);
    if (data.success) {
      await fetchGrades();
      setUpdate(false);
      setUpdateItem(null);
      message.success("update grade success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchDeleteGrade = async (id) => {
    const data = await apis.commonData.deleteGrade(id);
    if (data.success) {
      fetchGrades();
      message.success(t("delete success"));
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [listParams]);

  const columns = [
    {
      title: t("grade"),
      dataIndex: "grade",
      key: "grade",
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
      render: (id, grade) => (
        <div className="action-icon">
          <Edit handleClick={() => handleEdit(grade)} />
          <Delete handleClick={() => setShowModalDelete(id)} />
        </div>
      ),
    },
  ];

  const data = grades?.map((item, index) => ({
    key: index,
    id: item._id,
    grade: item.title,
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
    await fetchDeleteGrade(id);
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
      <div className="mastersetting__list--title">{t("grade")}</div>
      {isUpdate ? (
        <UpdateGrade
          handleClickBack={handleClickBack}
          t={t}
          updateItem={updateItem}
          fetchAddGrade={fetchAddGrade}
          fetchUpdateGrade={fetchUpdateGrade}
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
              total: numberOfGrades,
              defaultCurrent: listParams.offset,
              onChange: (pageNumber) => handleChangePagination(pageNumber),
              pageSize: listParams.limit,
              title: null,
            }}
          />
        </div>
      )}
      <BasicModalConfirm
        title={t("confirm_delete_grade_title")}
        content={t("confirm_delete_grade_content")}
        handleOk={handleOk}
        handleCancel={handleCancel}
        visible={showModal}
      />
    </div>
  );
}

export default Grade;
