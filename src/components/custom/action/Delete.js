import React from "react";
import { Icon, Button } from "antd";
import "../style.scss";

function Delete(props) {
  const { handleClick } = props;
  return (
    <div className="custom-action__button custom-action__delete-icon">
      <Button  onClick={handleClick} >
        <Icon type="delete"/>
      </Button>
    </div>
  );
}

export default Delete;
