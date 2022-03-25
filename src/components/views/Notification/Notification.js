import React, { useEffect, useRef, useState } from "react";
import { Icon, List, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./notification.scss";
import Header from "./Header";
import Footer from "./Footer";
import Axios from "axios";
import { NOTI_TYPE } from "../../common/constant";
import { getArrayLength } from "../../common/transformData";

const { Item } = List;
const { Text } = Typography;

function Notification(props) {
  const { t } = useTranslation();
  const [displayNoti, setDisplayNoti] = useState(false);
  const ref = useRef(null);
  const [notifications, setNoti] = useState([]);
  const [unreadNoti, setUnreadNoti] = useState(0);
  const { socket } = props;

  const fetchNotification = () => {
    Axios.post(`/api/notification/get-notifications`, null).then((response) => {
      if (response.data.success) {
        const data = response.data.notifications;
        setNoti(data);
        const unread = data.filter(item=>item.read === false)
        setUnreadNoti(getArrayLength(unread))
      } else if (!response.data.success) {
        alert(response.data.message);
      }
    });
  };

  useEffect(() => {
    // click outside of notification
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new-cv-noti", (data) => {
        fetchNotification();
      });
    }
  }, []);

  useEffect(() => {
    fetchNotification();
  }, []);

  const showNoti = () => {
    setDisplayNoti(true);
  };

  const hideNoti = () => {
    setDisplayNoti(false);
  };

  const data = notifications;

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      hideNoti();
    }
  };

  const getNotiTitle = (type) => {
    return NOTI_TYPE.find((item) => item.key === type);
  };

  const ListItemStyle = (item) => (
    <Item>
      <Text mark>[{getNotiTitle(item.type).text}]</Text>
      <br /> {t("detail")}
      <div style={{textAlign: "right", fontSize: "11px"}}>{t("created_at")}: {item.created_at}</div>
    </Item>
  );

  return (
    <div className="notification">
      <Icon
        type="notification"
        onClick={showNoti}
        className="notification__icon"
      />
      <div ref={ref}>
        {displayNoti ? (
          <List
            className="notification__content"
            header={
              <Header unreadNoti={unreadNoti} setDisplayNoti={setDisplayNoti} />
            }
            footer={<Footer unreadNoti={unreadNoti} />}
            bordered
            dataSource={data}
            renderItem={(item) => ListItemStyle(item)}
          ></List>
        ) : null}
      </div>
    </div>
  );
}

export default Notification;
