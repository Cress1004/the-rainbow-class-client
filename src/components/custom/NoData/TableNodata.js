import { Row } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import "./nodata.scss"

function TableNodata(props) {
  const { t } = useTranslation();

  return <Row className="no-data__text">{t("no_data")}</Row>;
}

export default TableNodata;
