import React from "react";
import { Route } from "react-router-dom";
import { Layout, Typography } from "antd";
import "./style.scss";
import RightMenu from "../NavBar/Sections/RightMenu";
import { useTranslation } from "react-i18next";
import Footer from "../Footer/Footer";

const { Title } = Typography;
const { Header, Content } = Layout;

const HomePageLayout = ({ children, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Header>
        <Title level={3} className="class-name">
          <a href="/">{t("Lớp học Cầu Vồng - The Rainbow Class")}</a>
        </Title>
        <div className="login-menu">
          <RightMenu />
        </div>
      </Header>
      <Content>
        <div className="site-layout-background">{children}</div>
        <Footer />
      </Content>
    </Layout>
  );
};

const HomePageLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Content className="content site-layout-background">
          <HomePageLayout>
            <Component {...matchProps} />
          </HomePageLayout>
        </Content>
      )}
    />
  );
};

export default HomePageLayoutRoute;
