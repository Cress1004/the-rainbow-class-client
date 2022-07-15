import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Form } from "antd";
import { Link } from "react-router-dom";
import "./profile.scss";
import { transformAddressData } from "../../../common/transformData";
import ChangePassword from "./ChangePassword";
import apis from "../../../apis";
import { VOLUNTEER } from "../../../common/constant";

const { Item } = Form;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function Profile() {
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState({});
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const fetchCurrentUserProfile = async () => {
    const data = await apis.users.getCurrentUserProfile();
    if (data.success) setUserData(data.userData);
  };

  const fetchChangeAvatar = async (newAvtLink) => {
    const data = await apis.users.changeAvatar(newAvtLink);
    if (data.success) {
      setShowChangeAvatar(false);
      fetchCurrentUserProfile();
    }
  };

  const fetchUploadAvatar = async (formData) => {
    const data = await apis.upload.uploadAvatar(formData);
    if (data.success) {
      setUserData({ ...userData, image: data.link });
      setShowChangeAvatar(true);
    }
  };

  useEffect(() => {
    fetchCurrentUserProfile();
  }, []);

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    fetchUploadAvatar(formData);
  };

  const submitSaveAvatar = () => {
    fetchChangeAvatar(userData.image);
  };

  const changeAvatar = () => {
    setShowChangeAvatar(true);
  };

  const hideChangePasswordPopup = () => {
    setShowChangePassword(false);
  };

  //Ngay sinh, dia chi
  return (
    <div>
      <div className="profile__title">{t("profile")}</div>
      <Row>
        <Col span={14} />
        <Col span={5}>
          <Button type="primary" className="profile__edit-button">
            <Link to={`/profile/edit`}>{t("edit_profile")}</Link>
          </Button>
        </Col>
        <Col span={5}>
          <Button
            type="primary"
            className="profile__change-password-button"
            onClick={() => setShowChangePassword(true)}
          >
            {t("change_password")}
          </Button>
        </Col>
      </Row>
      {userData && (
        <>
          <Row>
            <Col className="profile__left-block" span={6}>
              <img
                encType="multipart/form-data"
                className="profile__avatar"
                src={userData.image}
                alt="user-avatar"
                id="file"
              ></img>
              {showChangeAvatar ? (
                <div>
                  <input type="file" onChange={(e) => handleChangeAvatar(e)} />
                  <Button onClick={submitSaveAvatar}>{t("save_avatar")}</Button>
                </div>
              ) : (
                <Button onClick={changeAvatar}>{t("change_avatar")}</Button>
              )}
            </Col>
            <Col className="profile__right-block" span={18}>
              <Form {...layout} className="profile__info-area">
                <Item label={t("user_name")}>{userData.name}</Item>
                <Item label={t("email")}>{userData.email}</Item>
                <Item label={t("phone_number")}>{userData.phoneNumber}</Item>
                {userData.role === VOLUNTEER ? (
                  <Item label={t("link_facebook")}>{userData.linkFacebook}</Item>
                ) : null}
                <Item label={t("address")}>
                  {transformAddressData(userData.address)}
                </Item>
              </Form>
            </Col>
          </Row>
        </>
      )}
      {userData && (
        <ChangePassword
          showChangePassword={showChangePassword}
          userId={userId}
          layout={layout}
          hideChangePasswordPopup={hideChangePasswordPopup}
        />
      )}
    </div>
  );
}

export default Profile;
