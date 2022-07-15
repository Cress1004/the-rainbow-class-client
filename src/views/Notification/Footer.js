import React from "react";
import { useTranslation } from "react-i18next";
import "./notification.scss";

function Footer(props) {
  const { t } = useTranslation();
  const { unreadNoti } = props;
  return (
    <div
      className={`notification__footer notification__footer--${
        unreadNoti ? "active" : "deactive"
      }`}
    >
      {t("mark_read")}
    </div>
  );
}

export default Footer;
