/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Dropdown, Avatar, Icon } from "antd";
// import {DownOutlined} from '@ant-design/icons';
import axios from "axios";
import { USER_SERVER } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function RightMenu(props) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.userData);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
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
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          {user && (
            <Avatar
              className="avatar"
              src={user.image ? user.image : "/image/default-image.jpg"}
              style={{ width: "40px", height: "40px" }}
            />
          )}{" "}
          {user && user.name}
          <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

export default withRouter(RightMenu);
