import { Table } from "antd";
import React from "react";
import { getArrayLength } from "../../../common/transformData";
import TableNodata from "../../../components/custom/NoData/TableNodata";

function FreeTimeTable(props) {
  const { fixedData, columns } = props;
  return (
    <div>
      {getArrayLength(fixedData) ? (
        <Table
          className="upload-cv__free-time-table"
          columns={columns}
          dataSource={fixedData}
          pagination={false}
        ></Table>
      ) : (
        <TableNodata />
      )}
    </div>
  );
}

export default FreeTimeTable;
