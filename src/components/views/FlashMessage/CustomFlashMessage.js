import React from "react";
import FlashMessage from "react-flash-message";
import { Col, Icon } from "antd";
import "../style/app.scss";
import { STATUS } from "../../common/constant";

function CustomFlashMessage(props) {
  const { message } = props;
  const getIcon = (type) => {
    if (type === STATUS.success) return "check-circle";
    if (type === STATUS.error) return "exclamation-circle";
    if (type === STATUS.warning) return "close-circle";
  };
  return (
    <FlashMessage duration={5000} persistOnHover={true}>
      <div
        className={`custom__flash-message custom__flash-message--${message.type}`}
      >
        <Col span={2} className="custom__flash-message--icon">
          <Icon type={getIcon(message.type)} />{" "}
        </Col>
        <Col span={22}>
          <span>{message.content}</span>
        </Col>
      </div>
    </FlashMessage>
  );
}

export default CustomFlashMessage;
