/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, List, message, Popover, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./notification.scss";
import Axios from "axios";
import { NOTI_TYPE, NOTI_TYPE_TITLE } from "../../common/constant";
import { getArrayLength } from "../../common/transformData";
import moment from "moment";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import apis from "../../../apis";

const { Text } = Typography;

function Notification(props) {
  const { t } = useTranslation();
  const [displayNoti, setDisplayNoti] = useState(false);
  const ref = useRef(null);
  const [notifications, setNoti] = useState([]);
  const [unreadNoti, setUnreadNoti] = useState(0);
  const [pagination, setPagination] = useState({ limit: 10 });
  const [visible, setVisible] = useState(false);
  const { socket } = props;

  const fetchNotifications = async () => {
    const data = await apis.notifications.getNotifications(pagination);
    if (data.success) {
      setNoti(data.notifications);
      setUnreadNoti(data.count);
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Error");
    }
  };

  const fetchReadNotification = (id) => {
    Axios.get(`/api/notification/${id}`).then((response) => {
      if (response.data.success) {
        message.success("update status done!");
        fetchNotifications();
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
        fetchNotifications();
      });
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
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

  const handleSetVisible = () => {
    setVisible(!visible);
  };

  const getNotiTitle = (type) => {
    return NOTI_TYPE.find((item) => item.key === type);
  };

  const content = (
    data,
    // onRead, loading, hasMore, handleInfiniteOnLoad,
    t
  ) =>
    getArrayLength(data) ? (
      <div className="notification">
        <div ref={ref}>
          {displayNoti ? (
            <div className="infinite-container">
              <InfiniteScroll
                pageStart={0}
                // loadMore={() => handleFetch({ _limit: comments.length + 10 })}
                // hasMore={true || false}
                useWindow={false}
                loader={
                  <div key="loading" className="loader">
                    Loading ...
                  </div>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div>
                            <a
                            // onClick={(e) => onRead(e, item)}
                            >
                              <Text mark>[{getNotiTitle(item.type).text}]</Text>
                              <br />
                              {item?.content?.className}
                            </a>
                          </div>
                        }
                        description={
                          <>
                            <div style={{ float: "left" }}>
                              <Icon
                                className="header__notification--icon"
                                type="clock-circle"
                              />
                              {moment(item.created_at).format(
                                "h:mma D MMM YYYY"
                              )}
                            </div>
                            <div style={{ float: "right" }}>
                              {(() => {
                                switch (item.type) {
                                  case NOTI_TYPE_TITLE.NEW_CV:
                                    return (
                                      <Link
                                        to={`${item?.content?.path}/${item.content?.id}`}
                                      >
                                        <span>{t("detail")}</span>
                                      </Link>
                                    );
                                  case NOTI_TYPE_TITLE.REMIND_SET_MONITOR:
                                    return (
                                      <Link
                                        to={`/${item?.content?.path}/${item.content?.id}/set-monitor`}
                                      >
                                        <span
                                          onClick={() =>
                                            fetchReadNotification(item?._id)
                                          }
                                        >
                                          {t("detail")}
                                        </span>
                                      </Link>
                                    );
                                  case NOTI_TYPE_TITLE.NOTI_SET_INTERVIEW_PARTICIPANT:
                                    return (
                                      <Link
                                        to={`/${item?.content?.path}/${item.content?.id}`}
                                      >
                                        <span
                                          onClick={() =>
                                            fetchReadNotification(item?._id)
                                          }
                                        >
                                          {t("detail")}
                                        </span>
                                      </Link>
                                    );
                                  case NOTI_TYPE_TITLE.NOTI_UPGRADE_MONITOR_ROLE:
                                    return (
                                      <div>
                                        <Link
                                          to={`/${item?.content?.path}/${item.content?.id}`}
                                        >
                                          <span
                                            onClick={() =>
                                              fetchReadNotification(item?._id)
                                            }
                                          >
                                            {t("detail")}
                                          </span>
                                        </Link>
                                      </div>
                                    );
                                  case NOTI_TYPE_TITLE.NOTI_DOWNGRADE_MONITOR_ROLE:
                                    return (
                                      <div>
                                        <Link
                                          to={`/${item?.content?.path}/${item.content?.id}`}
                                        >
                                          <span
                                            onClick={() =>
                                              fetchReadNotification(item?._id)
                                            }
                                          >
                                            {t("detail")}
                                          </span>
                                        </Link>
                                      </div>
                                    );
                                  case NOTI_TYPE_TITLE.NOTI_INCHARGE_LESSON:
                                    return (
                                      <div>
                                        <Link
                                          to={`/classes/${item.content?.classId}/lessons/${item.content?.lessonId}`}
                                        >
                                          <span
                                            onClick={() =>
                                              fetchReadNotification(item?._id)
                                            }
                                          >
                                            {t("detail")}
                                          </span>
                                        </Link>
                                      </div>
                                    );
                                  default:
                                    return null;
                                }
                              })()}
                            </div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                >
                  {/* {loading && hasMore && (
                  <div>
                    <Spin />
                  </div>
                )} */}
                </List>
              </InfiniteScroll>
            </div>
          ) : null}
        </div>
      </div>
    ) : (
      t("no_notification")
    );

  return (
    <Popover
      content={content(
        data,
        // onRead,
        // loading,
        // hasMore,
        // this.handleInfiniteOnLoad,
        t
      )}
      title={
        <div className="header__notification--title">
          <div>{t("notification")}</div>
          <Button
            type="link"
            // onClick={() => onReadAll()}
          >
            {t("mark_all_as_read")}
          </Button>
        </div>
      }
      trigger="click"
      className="header__notification"
      visible={visible}
      placement="bottomRight"
      onVisibleChange={handleSetVisible}
      getPopupContainer={() => document.querySelector(".header__notification")}
    >
      <Icon
        type="notification"
        onClick={showNoti}
        className="notification__icon"
      />
      <span class="notification__header--unread">{unreadNoti}</span>
    </Popover>
  );
}

export default Notification;
