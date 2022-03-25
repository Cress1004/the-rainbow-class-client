import { Col, Row } from "antd";
import React from "react";

function Footer() {
  return (
    <div
      style={{
        height: "25px",
        display: "flex",
        padding: "0px 30px",
        fontSize: "13px",
      }}
    >
      <Row
        style={{
          width: "100%",
          position: "flex",
          bottom: "0px",
        }}
      >
        <Col
          span={12}
          style={{
            textAlign: "left",
          }}
        >
          <a href="https://www.facebook.com/therainbowclass">
            @therainbowclass
          </a>
        </Col>
        <Col
          span={12}
          style={{
            textAlign: "right",
          }}
        >
          Phản hồi về hệ thống
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
