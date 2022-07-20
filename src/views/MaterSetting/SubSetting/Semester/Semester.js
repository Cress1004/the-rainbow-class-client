import { Button, Table, Input, message, Icon } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../master-setting.scss";
import apis from "../../../../apis";
import Edit from "../../../../components/custom/action/Edit";
import Delete from "../../../../components/custom/action/Delete";
import BasicModalConfirm from "../../../../components/custom/modal/BasicModalConfirm";
import UpdateSemester from "./UpdateSemester";
import { transformDate } from "../../../../common/transformData";

function Semester() {
  const { t } = useTranslation();
  const [listParams, setListParams] = useState({ limit: 10 });
  const [deleteItem, setDeleteItem] = useState();
  const [updateItem, setUpdateItem] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [numberOfSemesters, setNumberOfSemesters] = useState(0);
  const [semesters, setSemesters] = useState([]);

  const fetchSemesters = async () => {
    const data = await apis.commonData.getSemestersWithParams(listParams);
    if (data.success) {
      setSemesters(data.semesters);
      setNumberOfSemesters(data.count);
    }
  };

  const fetchAddSemester = async (dataToSend) => {
    const data = await apis.commonData.addSemester(dataToSend);
    if (data.success) {
      fetchSemesters();
      setUpdate(false);
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchUpdateSemester = async (dataToSend) => {
    const data = await apis.commonData.updateSemester(dataToSend);
    if (data.success) {
      await fetchSemesters();
      setUpdate(false);
      setUpdateItem(null);
      message.success("update semester success");
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  const fetchDeleteSemester = async (id) => {
    const data = await apis.commonData.deleteSemester(id);
    if (data.success) {
      fetchSemesters();
      message.success(t("delete success"));
    } else if (!data.success) {
      message.error(data.message);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, [listParams]);

  const columns = [
    {
      title: t("semester"),
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("start_date"),
      dataIndex: "startDate",
      key: "startDate",
      width: "20%",
      render: (text) => <span>{transformDate(text)}</span>,
    },
    {
      title: t("end_date"),
      dataIndex: "endDate",
      key: "endDate",
      width: "20%",
      render: (text) => <span>{transformDate(text)}</span>,
    },
    {
      title: t("action"),
      key: "id",
      dataIndex: "id",
      render: (id, semester) => (
        <div className="action-icon">
          <Edit handleClick={() => handleEdit(semester)} />
          <Delete handleClick={() => setShowModalDelete(id)} />
        </div>
      ),
    },
  ];

  const data = semesters?.map((item, index) => ({
    key: index,
    id: item._id,
    title: item.title,
    startDate: item.startDate,
    endDate: item.endDate
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
    await fetchDeleteSemester(id);
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
      <div className="mastersetting__list--title">{t("semester")}</div>
      {isUpdate ? (
        <UpdateSemester
          handleClickBack={handleClickBack}
          t={t}
          updateItem={updateItem}
          fetchAddSemester={fetchAddSemester}
          fetchUpdateSemester={fetchUpdateSemester}
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
              total: numberOfSemesters,
              defaultCurrent: listParams.offset,
              onChange: (pageNumber) => handleChangePagination(pageNumber),
              pageSize: listParams.limit,
              title: null,
            }}
          />
        </div>
      )}
      <BasicModalConfirm
        title={t("confirm_delete_semester_title")}
        content={t("confirm_delete_semester_content")}
        handleOk={handleOk}
        handleCancel={handleCancel}
        visible={showModal}
      />
    </div>
  );
}

export default Semester;
