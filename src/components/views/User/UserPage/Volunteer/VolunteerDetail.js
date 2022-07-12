import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Dropdown,
  Menu,
  Icon,
  DatePicker,
} from "antd";
import {
  convertDateStringToMoment,
  transformAddressData,
  transformDate,
} from "../../../../common/transformData";
import {
  CLASS_MONITOR,
  FORMAT_DATE,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
  VOLUNTEER_STATUS,
  VOLUNTEER_STATUS_TITLE,
} from "../../../../common/constant";
import PermissionDenied from "../../../Error/PermissionDenied";
import { checkAdminAndMonitorRole } from "../../../../common/function";
import useFetchCurrentUserData from "../../../../../hook/User/useFetchCurrentUserData";
import apis from "../../../../../apis";
import { useFormik } from "formik";
import * as Yup from "yup";

const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function VolunteerDetail(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPopupInputRetiredDate, setShowPopupInputRetiredDate] =
    useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState();
  const [volunteerData, setVolunteerData] = useState();
  const currentUser = useFetchCurrentUserData();
  const userRole = currentUser.userRole;

  const leftLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  };
  const formik = useFormik({
    initialValues: {
      volunteerId: id,
      retirementDate: convertDateStringToMoment(new Date()),
      status: VOLUNTEER_STATUS_TITLE.RETIRED,
    },
    validationSchema: Yup.object({
      retirementDate: Yup.string()
        .required(t("required_retirement_date"))
        .nullable(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        fetchChangeVolunteerStatus(id, { dataToSend: values });
        setShowPopupInputRetiredDate(false);
        setSubmitting(false);
      }, 400);
    },
  });

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const fetchChangeVolunteerStatus = async (volunteerId, dataToSend) => {
    const data = await apis.volunteer.changeStatus(volunteerId, dataToSend);
    if (data.success) {
      fetchVolunteerData(volunteerId);
    } else {
      alert(t("fail_to_change_volunteer_status"));
    }
  };

  const fetchVolunteerData = async () => {
    const data = await apis.volunteer.getVolunteerData(id);
    if (data.success) {
      const volunteer = data.volunteer;
      setVolunteerData({
        id: volunteer._id,
        name: volunteer.user.name,
        email: volunteer.user.email,
        gender: volunteer.user.gender,
        image: volunteer.user.image,
        address: volunteer.user.address,
        phoneNumber: volunteer.user.phoneNumber,
        volunteerRole: volunteer.role,
        className: volunteer.user.class?.name,
        isAdmin: volunteer.isAdmin,
        role: data.volunteerRole,
        linkFacebook: volunteer.user.linkFacebook,
        retirementDate: volunteer.retirementDate,
        updatedBy: volunteer.updatedBy?.name
      });
      setVolunteerStatus(
        VOLUNTEER_STATUS.find(
          (item) => item.key === (volunteer.retirementDate ? 1 : 0)
        )
      );
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchDeleteVolunteer = async (volunteerId) => {
    const data = await apis.volunteer.deleteVolunteer(volunteerId);
    if (data.success) {
      alert(t("delete_volunteer_success"));
      history.push("/volunteers");
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const checkFillAllData = () => {
    return formik.values.retirementDate;
  };

  const deleteVolunteer = () => {
    setConfirmDelete(false);
    fetchDeleteVolunteer(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const statusMenuList = () => {
    return (
      <Menu>
        <Menu.Item
          key={VOLUNTEER_STATUS[1].key}
          onClick={() => setShowPopupInputRetiredDate(true)}
        >
          {VOLUNTEER_STATUS[1].text}
        </Menu.Item>
      </Menu>
    );
  };

  const transformRoleWithClass = (className, role) => {
    if (role === CLASS_MONITOR) return `${t("class_monitor")} - ${className}`;
    if (role === SUB_CLASS_MONITOR)
      return `${t("sub_class_monitor")} - ${className}`;
    return `${t("volunteer")} - ${className}`;
  };

  if (userRole.subRole === SUPER_ADMIN || !volunteerData) {
    return <PermissionDenied />;
  }

  return (
    <div className="volunteer-detail">
      <div className="volunteer-detail__title">{t("volunteer_detail")}</div>
      <Row className="volunteer-detail__action-row">
        {checkAdminAndMonitorRole(userRole) ? (
          <Button type="primary" className="volunteer-detail-volunteer-button">
            <Link to={`/volunteers/${id}/edit`}>{t("edit_volunteer")}</Link>
          </Button>
        ) : null}
        {checkAdminAndMonitorRole(userRole) ? (
          <Button
            type="danger"
            className="volunteer-detail__delete-volunteer-button"
            onClick={openDeletePopup}
          >
            {t("delete_volunteer")}
          </Button>
        ) : null}
      </Row>
      {volunteerData && (
        <>
          <Row>
            <Col className="volunteer-detail__left-block" span={6}>
              <img
                className="volunteer-detail__avatar"
                src={volunteerData.image}
                alt="user-avatar"
              ></img>
              <h3>{volunteerData.name}</h3>
              {checkAdminAndMonitorRole(userRole) ? (
                <Item className="volunteer-detail__status">
                  {volunteerStatus?.key === VOLUNTEER_STATUS_TITLE.WORKING ? (
                    <div className={`volunteer-detail__status`}>
                      <Dropdown.Button
                        className={`ant-btn--${volunteerStatus?.value}`}
                        overlay={statusMenuList}
                        icon={<Icon type="down" />}
                        trigger={["click"]}
                        disabled={
                          volunteerStatus?.key === VOLUNTEER_STATUS[1].key
                        }
                      >
                        {volunteerStatus?.text}
                      </Dropdown.Button>
                    </div>
                  ) : (
                    <Button className={`ant-btn--${volunteerStatus?.value}`}>
                      {volunteerStatus?.text}
                    </Button>
                  )}
                </Item>
              ) : (
                <Item>
                  {volunteerStatus?.key === VOLUNTEER_STATUS_TITLE.WORKING ? (
                    <Button className={`ant-btn--${volunteerStatus?.value}`}>
                      {volunteerStatus?.text}
                    </Button>
                  ) : (
                    <Button className={`ant-btn--${volunteerStatus?.value}`}>
                      {volunteerStatus?.text}
                    </Button>
                  )}
                </Item>
              )}
               <Form {...leftLayout} className="student-detail__info-area">
                {volunteerStatus?.key === VOLUNTEER_STATUS_TITLE.RETIRED ? (
                  <div>
                    <Item label={t("Ngày nghỉ HĐ")}>
                      {transformDate(volunteerData.retirementDate)}
                    </Item>
                    <Item label={t("updated_by")}>{volunteerData.updatedBy}</Item>
                  </div>
                ) : null}
              </Form>
            </Col>
            <Col className="volunteer-detail__right-block" span={18}>
              <Form {...layout} className="volunteer-detail__info-area">
                <Item label={t("user_name")}>{volunteerData.name}</Item>
                <Item label={t("email")}>{volunteerData.email}</Item>
                <Item label={t("address")}>
                  {transformAddressData(volunteerData.address)}
                </Item>
                <Item label={t("phone_number")}>
                  {volunteerData.phoneNumber}
                </Item>
                <Item label={t("link_facebook")}>
                  <a href={volunteerData.linkFacebook}>
                    {volunteerData.linkFacebook}
                  </a>
                </Item>
                <Item label={t("role")}>
                  {transformRoleWithClass(
                    volunteerData.className,
                    volunteerData.volunteerRole
                  )}
                </Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
      <Modal
        title={t("modal_confirm_delete_volunteer_title")}
        visible={confirmDelete}
        onOk={deleteVolunteer}
        onCancel={cancelDelete}
        okText={t("delete_volunteer")}
        cancelText={t("cancel")}
        footer={[
          <Button onClick={cancelDelete}>{t("cancel")}</Button>,
          <Button onClick={deleteVolunteer} type="danger">
            {t("delete_volunteer")}
          </Button>,
        ]}
      >
        {t("modal_confirm_delete_volunteer_content")}
      </Modal>
      <Modal
        title={t("Nhập vào ngày nghỉ hoạt động")}
        visible={showPopupInputRetiredDate}
        onOk={formik.handleSubmit}
        onCancel={() => setShowPopupInputRetiredDate(false)}
        okText={t("submit")}
        cancelText={t("cancel")}
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowPopupInputRetiredDate(false)}
          >
            {t("cancel")}
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={formik.handleSubmit}
            disabled={!checkFillAllData()}
          >
            {t("submit")}
          </Button>,
        ]}
      >
        {" "}
        <Form className="">
          <Item label={t("Ngày nghỉ hoạt động")}>
            <DatePicker
              format={FORMAT_DATE}
              defaultValue={formik.values.retirementDate}
              name="retirementDate"
              onChange={(dateString) =>
                formik.setFieldValue("retirementDate", dateString)
              }
              placeholder={t("Nhập vào ngày nghỉ hoạt động")}
            />
          </Item>
        </Form>
      </Modal>
    </div>
  );
}

export default VolunteerDetail;
