import React from "react";
import { Icon, Button } from "antd";
import "../style.scss";

function Edit(props) {
  const { handleClick, disable } = props;
  return (
    <div className="custom-action__button custom-action__edit-icon">
      <Button onClick={handleClick} disabled={disable}>
        <Icon type="edit" />
      </Button>
    </div>
  );
}

export default Edit;
