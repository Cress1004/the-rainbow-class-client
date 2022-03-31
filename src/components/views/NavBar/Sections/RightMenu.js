/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Dropdown, Avatar, Icon } from "antd";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { USER_API } from "../../../../config";
import { convertRole } from "../../../common/function";
import "./right-menu.scss";

function RightMenu(props) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.userData);

  const logoutHandler = () => {
    axios.get(`${USER_API}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert(t("login_fail_message"));
      }
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="/profile">{t("profile")}</a>
      </Menu.Item>
      <Menu.Item key="logout">
        <a onClick={logoutHandler}>{t("logout")}</a>
      </Menu.Item>
    </Menu>
  );

  if (user && !user.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="login">
          <a href="/login">{t("login")}</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Dropdown overlay={menu} className="right-menu" trigger={['click']}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          {user && (
            <>
              <Avatar
                className="right-menu__avatar"
                src={user.image ? user.image : "/image/default-image.jpg"}
              />
              <div className="right-menu__user-info">
              <span className="right-menu__user-name">{user.name}</span>
              <span className="right-menu__role">{convertRole(user.role)?.vie}</span>
              </div>
              <Icon type="down" className="right-menu__dropdown-icon"/>
            </>
          )}
        </a>
      </Dropdown>
    );
  }
}

export default withRouter(RightMenu);
