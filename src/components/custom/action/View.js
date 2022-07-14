import React from "react";
import { Icon, Button } from "antd";
import "../style.scss";

function View(props) {
  const { handleClick } = props;
  return (
    <div className="custom-action__button custom-action__view-icon">
      <Button  onClick={handleClick} >
        <Icon type="eye"/>
      </Button>
    </div>
  );
}

export default View;
