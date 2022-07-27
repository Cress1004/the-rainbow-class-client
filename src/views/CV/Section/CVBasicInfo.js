import { Col, Divider, Dropdown, Form, Icon, Row } from "antd";
import React from "react";
import { CV_STATUS_NAME, FORMAT_DATE } from "../../../common/constant";
import {
  getArrayLength,
  transformScheduleTimeData,
} from "../../../common/transformData";
import FreeTimeTable from "./FreeTimeTable";
import moment from "moment";

const { Item } = Form;
function CVBasicInfo(props) {
  const {
    leftLayout,
    t,
    cvData,
    columns,
    fixedData,
    rightLayout,
    cvStatus,
    setConfirmInterview,
    showCV,
    showVideo,
    setShowCV,
    setShowVideo,
    answers,
    viewCVAnswer,
    setViewCVAnswer,
    statusMenuList,
    pdfDoc,
    scale,
    downloadFile,
    checkCVDataStatus,
  } = props;
  return (
    <div>
      <div className="cv-detail__subtitle">{t("register_info")}</div>
      <Row>
        <Col span={12}>
          <Form {...leftLayout} className="cv-detail__show-detail">
            <Item label={t("user_name")}>{cvData.userName}</Item>
            <Item label={t("email")}>{cvData.email}</Item>
            <Item label={t("phone_number")}>{cvData.phoneNumber}</Item>
          </Form>
        </Col>
        <Col span={12}>
          <Form {...rightLayout} className="cv-detail__show-detail">
            <Item label={t("create_time")}>
              {moment(cvData.created_at).format(FORMAT_DATE)}
            </Item>
            <Item label={t("register_class")}>{cvData.class?.name}</Item>
            {cvStatus ? (
              <div>
                <Item label={t("status")}>
                  <div className={`cv-detail__status`}>
                    <Dropdown.Button
                      className={`ant-btn--${cvStatus.value}`}
                      overlay={statusMenuList}
                      icon={<Icon type="down" />}
                      trigger={["click"]}
                      disabled={
                        checkCVDataStatus(CV_STATUS_NAME.FAIL) ||
                        checkCVDataStatus(CV_STATUS_NAME.PASS)
                      }
                      getPopupContainer={(trigger) => trigger.parentElement}
                    >
                      {cvStatus.text}
                    </Dropdown.Button>
                  </div>
                </Item>
                {cvData.status === CV_STATUS_NAME.WAITING ? (
                  <>
                    <Item label={t("interview_time")}>
                      {transformScheduleTimeData(cvData?.schedule?.time)}{" "}
                      <Icon
                        type="edit"
                        onClick={() => setConfirmInterview(true)}
                      />
                    </Item>
                    <Item label={t("interview_link")}>
                      <a
                        href={cvData.schedule?.linkOnline}
                      >{`${cvData.schedule?.linkOnline?.slice(0, 25)}...`}</a>
                    </Item>
                  </>
                ) : null}
                {getArrayLength(cvData.schedule?.participants) ? (
                  <Item label={t("interviewer")}>
                    {cvData.schedule.participants.map((item) => (
                      <>
                        <span>{item.name}</span>
                        <br />
                      </>
                    ))}
                  </Item>
                ) : null}
              </div>
            ) : null}
          </Form>
        </Col>
        <Divider />
        <div className="cv-detail__subtitle">{t("free_time_table")}</div>
        <FreeTimeTable t={t} columns={columns} fixedData={fixedData} />
        <Item label={t("note")}>{cvData?.note || t("no_comment")}</Item>
      </Row>
      <Divider />
      <div className="cv-detail__subtitle">
        {t("show_cv")}
        <Icon
          type={showCV ? "down-circle" : "right-circle"}
          onClick={() => setShowCV(!showCV)}
          className="cv-detail__show-icon"
        />
      </div>
      {showCV ? (
        <>
          {scale}
          <div style={{ textAlign: "right" }}>
            <a onClick={() => downloadFile()} target="_blank">
              {t("download_cv_here")}
            </a>
          </div>
          <div className="all-page-container">{pdfDoc}</div>
        </>
      ) : null}
      <Divider />
      <div className="cv-detail__subtitle">
        {t("show_cv_answers")}
        <Icon
          type={viewCVAnswer ? "down-circle" : "right-circle"}
          onClick={() => setViewCVAnswer(!viewCVAnswer)}
          className="cv-detail__show-icon"
        />
      </div>
      {viewCVAnswer ? (
        <>
          {answers.map((answer) => (
            <div className="cv-detail__answer-detail">
              <Item
                label={answer.question.content}
                required={answer.question.isRequired}
              >
                {answer.content}
              </Item>
            </div>
          ))}
        </>
      ) : null}
      <Divider />
      {cvData.audioFileLink ? (
        <>
          {" "}
          <div className="cv-detail__subtitle">
            {t("audio_intro_by_english")}
            <Icon
              type={showVideo ? "down-circle" : "right-circle"}
              onClick={() => setShowVideo(!showVideo)}
              className="cv-detail__show-icon"
            />
          </div>
          {showVideo ? (
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <audio controls>
                <source src={cvData.audioFileLink} type="video/mp4" />
              </audio>
            </div>
          ) : null}
          <Divider />
        </>
      ) : null}
    </div>
  );
}

export default CVBasicInfo;
