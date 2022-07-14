import React from "react";
import { Icon, Button } from "antd";
import "../style.scss";

function Edit(props) {
  const { handleClick } = props;
  return (
    <div className="custom-action__button custom-action__edit-icon">
      <Button  onClick={handleClick} >
        <Icon type="edit"/>
      </Button>
    </div>
  );
}

export default Edit;
