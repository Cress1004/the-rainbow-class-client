import React, { useEffect, useRef, useState } from "react";
import { Icon, List, message, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./notification.scss";
import Header from "./Header";
import Footer from "./Footer";
import Axios from "axios";
import { NOTI_TYPE, NOTI_TYPE_TITLE } from "../../common/constant";
import { getArrayLength } from "../../common/transformData";
import moment from "moment";
import { Link } from "react-router-dom";

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
        const unread = data.filter((item) => item.data.read === false);
        setNoti(unread);
        setUnreadNoti(getArrayLength(unread));
      } else if (!response.data.success) {
        alert(response.data.message);
      }
    });
  };

  const fetchReadNotification = (id) => {
    Axios.get(`/api/notification/${id}`).then((response) => {
      if (response.data.success) {
        message.success("update status done!");
      } else if (!response.data.success) {
        message.error("update status fail!");
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

  const getLinkNoti = (noti) => {
    switch (noti.data.type) {
      case NOTI_TYPE_TITLE.NEW_CV:
        return (
          <Link to={`/cv/${noti?.notiCV?.cv?._id}`}>
            <span onClick={() => fetchReadNotification(noti.data._id)}>
              {t("detail")}
            </span>
          </Link>
        );
      case NOTI_TYPE_TITLE.ASSIGN_LESSON:
        return (
          <Link>
            <span onClick={() => fetchReadNotification(noti.data._id)}>
              {t("detail")}
            </span>
          </Link>
        );
      case NOTI_TYPE_TITLE.ASSIGN_INTERVIEW:
        return (
          <Link>
            <span onClick={() => fetchReadNotification(noti.data._id)}>
              {t("detail")}
            </span>
          </Link>
        );
      default:
        break;
    }
  };

  const ListItemStyle = (item) => (
    <Item>
      <Text mark>[{getNotiTitle(item.data.type).text}]</Text> -{" "}
      {`Lớp học ${item.notiCV.cv.class.name} `}
      <br />
      {getLinkNoti(item)}
      <div style={{ textAlign: "right", fontSize: "11px" }}>
        {t("time")}: {moment(item.data.created_at).format("h:mma D MMM YYYY")}
      </div>
    </Item>
  );

  return (
    <div className="notification">
      <Icon
        type="notification"
        onClick={showNoti}
        className="notification__icon"
      />
      <span class="notification__header--unread">{unreadNoti}</span>
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
