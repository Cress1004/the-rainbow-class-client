import React, { useState } from "react";
import { Route } from "react-router-dom";
import { Layout, Menu, Typography, Icon } from "antd";
import { Link } from "react-router-dom";
import "./style.scss";
import RightMenu from "../NavBar/Sections/RightMenu";
import { useTranslation } from "react-i18next";
import {
  CLASS_MONITOR,
  STUDENT,
  SUB_CLASS_MONITOR,
  SUPER_ADMIN,
  VOLUNTEER,
} from "../../common/constant";
import useFetchRole from "../../../hook/useFetchRole";
import Footer from "../Footer/Footer";
import Notification from "../Notification/Notification";

const { Title } = Typography;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const DashboardLayout = ({ children, ...rest }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const userId = localStorage.getItem("userId");
  const userData = useFetchRole(userId);
  const userRole = userData.userRole;
  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout>
      <Header>
        <Title level={3} className="class-name">
          <a href="/">{t("Lớp học Cầu Vồng - The Rainbow Class")}</a>
        </Title>
        <div className="login-menu">
          <Notification socket={rest.socket}/>
          <RightMenu />
        </div>
      </Header>
      <Content>
        {userRole && (
          <Layout>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={handleCollapse}
            >
              {userRole.role === STUDENT && (
                <Menu defaultSelectedKeys={["1"]} mode="inline">
                  <Menu.Item key="my_schedule">
                    <Link to="/dashboard">
                      <Icon type="home" />
                      <span>{t("dashboard")}</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="volunteers">
                    <Icon type="user" />
                    <span>{t("volunteer")}</span>
                    <Link to="/volunteers"></Link>
                  </Menu.Item>
                  <Menu.Item key="students">
                    <Icon type="solution" />
                    <span> {t("student")}</span>
                    <Link to="/students"></Link>
                  </Menu.Item>
                  <Menu.Item key="my_Class">
                    <Link to={`/classes/${userData.userClassId}`}>
                      <Icon type="book" />
                      <span> {t("my_class")}</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              )}
              {userRole.subRole === SUPER_ADMIN && (
                <Menu defaultSelectedKeys={["1"]} mode="inline">
                  <Menu.Item key="list_admin">
                    <Link to="/admin">
                      <Icon type="user" />
                      <span>{t("admin")}</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              )}
              {userRole.isAdmin && (
                <Menu defaultSelectedKeys={["1"]} mode="inline">
                  <Menu.Item key="my_schedule">
                    <Link to="/dashboard">
                      <Icon type="home" />
                      <span>{t("dashboard")}</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="schedule">
                    <Link to="/schedules">
                      <Icon type="calendar" />
                      <span>{t("schedule_manager")}</span>
                    </Link>
                  </Menu.Item>
                  <SubMenu
                    key="user_manager"
                    title={
                      <span>
                        <Icon type="user" />
                        <span>{t("user_manager")}</span>
                      </span>
                    }
                  >
                    <Menu.Item key="admin">
                      <Link to="/admin">{t("admin")}</Link>
                    </Menu.Item>
                    <Menu.Item key="volunteer">
                      {t("volunteer")}
                      <Link to="/volunteers"></Link>
                    </Menu.Item>
                    <Menu.Item key="student">
                      {t("student")}
                      <Link to="/students"></Link>
                    </Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="class_manager"
                    title={
                      <span>
                        <Icon type="book" />
                        <span>{t("class_manager")}</span>
                      </span>
                    }
                  >
                    <Menu.Item key="class_manager">
                      <Link to="/classes">{t("class_list")}</Link>
                    </Menu.Item>
                    <Menu.Item key="my_class">
                      <Link to={`/classes/${userData.userClassId}`}>
                        {t("my_class")}
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="cv_manager">
                    <Link to="/cv">
                      <Icon type="idcard" />
                      <span>{t("cv_manager")}</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="master_setting">
                    <Link to="/master-setting">
                      <Icon type="setting" />
                      <span>{t("master_setting")}</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              )}
              {!userRole.isAdmin &&
                (userRole.subRole === SUB_CLASS_MONITOR ||
                  userRole.subRole === CLASS_MONITOR ||
                  userRole.subRole === VOLUNTEER) && (
                  <Menu defaultSelectedKeys={["1"]} mode="inline">
                    <Menu.Item key="my_schedule">
                      <Link to="/dashboard">
                        <Icon type="home" />
                        <span>{t("dashboard")}</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="schedule">
                      <Link to="/schedules">
                        <Icon type="calendar" />
                        <span>{t("schedule_manager")}</span>
                      </Link>
                    </Menu.Item>
                    <SubMenu
                      key="user_manager"
                      title={
                        <span>
                          <Icon type="user" />
                          <span>{t("user_manager")}</span>
                        </span>
                      }
                    >
                      <Menu.Item key="admin">
                        <Link to="/admin">{t("admin")}</Link>
                      </Menu.Item>
                      <Menu.Item key="volunteer">
                        {t("volunteer")}
                        <Link to="/volunteers"></Link>
                      </Menu.Item>
                      <Menu.Item key="student">
                        {t("student")}
                        <Link to="/students"></Link>
                      </Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="class_manager"
                      title={
                        <span>
                          <Icon type="book" />
                          <span>{t("class_manager")}</span>
                        </span>
                      }
                    >
                      <Menu.Item key="classes">
                        <Link to="/classes">{t("class_list")}</Link>
                      </Menu.Item>
                      <Menu.Item key="my_class">
                        <Link to={`/classes/${userData.userClassId}`}>
                          {t("my_class")}
                        </Link>
                      </Menu.Item>
                    </SubMenu>
                    {userRole.subRole !== VOLUNTEER && (
                      <Menu.Item key="cv_manager">
                        <Link to="/cv">
                          <Icon type="idcard" />
                          <span>{t("cv_manager")}</span>
                        </Link>
                      </Menu.Item>
                    )}
                  </Menu>
                )}
            </Sider>
            <Layout className="site-layout">
              <Content>
                <div className="site-layout-background">{children}</div>
                <Footer />
              </Content>
            </Layout>
          </Layout>
        )}
      </Content>
    </Layout>
  );
};

const DashboardLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Content className="content site-layout-background">
          <DashboardLayout socket={rest.socket}>
            <Component {...matchProps} />
          </DashboardLayout>
        </Content>
      )}
    />
  );
};

export default DashboardLayoutRoute;
