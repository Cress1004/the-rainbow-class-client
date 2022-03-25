import { Table } from "antd";
import React from "react";

function FreeTimeTable(props) {
  const { fixedData, columns } = props;
  return (
    <div>
      <Table
        className="upload-cv__free-time-table"
        columns={columns}
        dataSource={fixedData}
        pagination={false}
      ></Table>
    </div>
  );
}

export default FreeTimeTable;
