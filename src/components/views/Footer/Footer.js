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
          <a href="https://forms.gle/6LHENFLi5t7fpumC9">Phản hồi về hệ thống</a>
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
