import React from "react";
import { Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Typography } from "antd";

import "./style.scss";

const { Title } = Typography;

const LoginLayout = ({ children, t }) => (
  <div>
    <div className="login-background">
      <div className="info-area">
        <Title level={3}>{t("welcome_message")}</Title>
        <br />
        <img
          className="logo"
          height="70%"
          width="70%"
          src="/images/logo.png"
          alt="logo"
        />
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const LoginLayoutRoute = ({ component: Component, ...rest }) => {
  const { t } = useTranslation();
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <LoginLayout t = { t }>
          <Component {...matchProps} />
        </LoginLayout>
      )}
    />
  );
};

export default LoginLayoutRoute;
