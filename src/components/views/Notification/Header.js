import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import "./notification.scss";

function Header(props) {
  const { t } = useTranslation();
  const { unreadNoti, setDisplayNoti } = props;

  return (
    <div className="notification__header">
      {`${t("notification")} (${unreadNoti})`}

      <div className="notification__close-icon">
        <a onClick={() => setDisplayNoti(false)}>[x]</a>
      </div>
    </div>
  );
}

export default Header;
