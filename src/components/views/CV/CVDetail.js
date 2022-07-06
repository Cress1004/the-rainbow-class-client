import { Col, Row, Form, Button, Icon, Divider, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Document, Page, pdfjs } from "react-pdf";
import { Checkbox } from "antd";
import "video-react/dist/video-react.css";

import {
  CV_STATUS,
  CV_STATUS_NAME,
  FORMAT_DATE,
  NOON_TIME,
  WEEKDAY,
} from "../../common/constant";
import moment from "moment";
import {
  getArrayLength,
  transformScheduleTimeData,
} from "../../common/transformData";
import { Menu } from "antd";
import { Dropdown } from "antd";
import { useFormik } from "formik";
import ConfirmRejectStatus from "./Section/ConfirmRejectStatus";
import SetInterviewTime from "./Section/SetInterviewTime";
import FreeTimeTable from "./Section/FreeTimeTable";
import ConfirmPassStatus from "./Section/ConfirmPassStatus";
import apis from "../../../apis";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Item } = Form;
const MAX_SCALE = 2.1;
const MIN_SCALE = 0.5;
const SCALE_STEP = 0.1;

function CVDetail(props) {
  const { t } = useTranslation();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const { id } = useParams();
  const [cvData, setCVData] = useState({});
  const [totalPages, setTotalPages] = useState(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [showCV, setShowCV] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [confirmInterview, setConfirmInterview] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [viewCVAnswer, setViewCVAnswer] = useState(false);
  const [videoModalActive, setVideoModalActive] = useState(false);
  const cvStatus = CV_STATUS.find((item) => item.key === cvData?.status);

  const fetchCVData = async (id) => {
    const data = await apis.cv.getCVData(id);
    if (data.success) {
      setCVData(data.cvData);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchAnswers = async (id) => {
    const data = await apis.cvAnswer.getAnswerWithCV(id);
    if (data.success) {
      setAnswers(data.answers);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchUpdateCVStatus = async (id, values) => {
    const data = await apis.cv.updateCVStatus(values);
    if (data.success) {
      fetchCVData(id);
      setConfirmReject(false);
      setConfirmInterview(false);
      setConfirmPass(false);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    fetchCVData(id);
    fetchAnswers(id);
  }, [id]);

  const formik = useFormik({
    initialValues: {
      cvId: id,
      status: cvData.status,
      date: cvData.schedule?.time.date,
      startTime: cvData.schedule?.time.startTime,
      endTime: cvData.schedule?.time.endTime,
      participants: cvData.schedule?.paticipants,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        fetchUpdateCVStatus(id, values);
        setSubmitting(false);
      }, 400);
    },
  });

  const columns = [
    {
      title: "",
      dataIndex: "time",
      fixed: true,
      width: 120,
    },
  ];

  WEEKDAY.map((item) => {
    if (item.key !== 0)
      columns.push({
        title: item.text,
        key: item.key,
        dataIndex: "status",
        render: (record) => (
          <Checkbox
            text={`${item.key}-${record.key}`}
            disabled
            checked={checkFreeTime(item.key, record.key)}
          ></Checkbox>
        ),
      });
  });

  const fixedData = NOON_TIME.map((item) => ({
    key: item.key,
    time: `${item.startTime} - ${item.endTime}`,
    status: {
      key: item.key,
      active: false,
    },
  }));

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  const checkFreeTime = (currWeekday, currNoon) => {
    if (getArrayLength(cvData.freeTimeList)) {
      var freeTime = cvData.freeTimeList.find(
        (item) => item.weekDay === currWeekday && item.noon === currNoon
      );
      return freeTime ? true : false;
    }
    return false;
  };

  const changeScale = (offset) => {
    const newScale = currentScale + offset;
    if (newScale <= MAX_SCALE && newScale >= MIN_SCALE)
      setCurrentScale(currentScale + offset);
  };

  const zoomIn = () => changeScale(SCALE_STEP);
  const zoomOut = () => changeScale(-SCALE_STEP);

  const checkOverMaxScale = () => {
    return currentScale + SCALE_STEP > MAX_SCALE;
  };

  const checkOverMinScale = () => {
    return currentScale - SCALE_STEP < MIN_SCALE;
  };
  const downloadFile = () => {
    window.open(cvData.cvFileLink, "_blank");
  };

  const closeModal = () => {
    setVideoModalActive(false);
  };

  const changeStatus = ({ key }) => {
    const selected = parseInt(key);
    if (selected === CV_STATUS_NAME.FAIL) setConfirmReject(true);
    if (selected === CV_STATUS_NAME.WAITING) setConfirmInterview(true);
    if (selected === CV_STATUS_NAME.PASS) setConfirmPass(true);
    formik.setFieldValue("status", selected);
  };

  const checkCVDataStatus = (compareStatusText) => {
    return cvData.status === compareStatusText;
  };

  const scale = (
    <div className="cv-detail__scale-button" style={{ textAlign: "center" }}>
      <Button onClick={zoomOut} disabled={checkOverMinScale()}>
        <Icon type="minus-circle" />
      </Button>
      <div className="cv-detail__scale">{Math.floor(currentScale * 100)}%</div>
      <Button onClick={zoomIn} disabled={checkOverMaxScale()}>
        <Icon type="plus-circle" />
      </Button>
    </div>
  );

  const pdfDoc = (
    <Document
      file={cvData.cvFileLink}
      options={{ workerSrc: "/pdf.worker.js" }}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={console.error}
    >
      {Array.from(new Array(totalPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          scale={currentScale}
        />
      ))}
    </Document>
  );

  const statusMenuList = () => {
    let listChangeStatus = [];
    if (checkCVDataStatus(CV_STATUS_NAME.PENDING)) {
      listChangeStatus = CV_STATUS.filter(
        (item) => item.key !== cvData.status && item.key !== CV_STATUS_NAME.PASS
      );
    } else if (checkCVDataStatus(CV_STATUS_NAME.WAITING)) {
      listChangeStatus = CV_STATUS.filter(
        (item) =>
          item.key !== cvData.status && item.key !== CV_STATUS_NAME.PENDING
      );
    }
    return (
      <Menu onClick={changeStatus}>
        {listChangeStatus.map((item) => (
          <Menu.Item key={item.key}>{item.text}</Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <div className="cv-detail">
      <div className="cv-detail__title">{t("cv_detail")}</div>
      <Row>
        <Col span={10}>
          <Form {...layout} className="cv-detail__show-detail">
            <Item label={t("user_name")}>{cvData.userName}</Item>
            <Item label={t("email")}>{cvData.email}</Item>
            <Item label={t("phone_number")}>{cvData.phoneNumber}</Item>
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
                    >
                      {cvStatus.text}
                    </Dropdown.Button>
                  </div>
                </Item>
                {cvData.status === CV_STATUS_NAME.WAITING ? (
                  <>
                    <Item label={t("interview_time")}>
                      {transformScheduleTimeData(cvData.schedule.time)}{" "}
                      <Icon
                        type="edit"
                        onClick={() => setConfirmInterview(true)}
                      />
                    </Item>
                  </>
                ) : null}
              </div>
            ) : null}
            <Item label={t("cv_file")}>
              <a onClick={() => downloadFile()} target="_blank">
                {t("download_here")}
              </a>
            </Item>
            {cvData.audioFileLink ? (
              <Item label={t("audio_intro_by_english")}>
                <Button onClick={() => setVideoModalActive(true)}>
                  {t("show_audio")}
                </Button>
              </Item>
            ) : (
              <></>
            )}
            <Modal
              title={t("audio_intro_by_english")}
              id="video-modal"
              visible={videoModalActive}
              onCancel={closeModal}
              onOk={closeModal}
              width="55%"
              bodyStyle={{ height: 300, width: 400 }}
            >
              <video width="320" height="240" controls>
                <source src={cvData.audioFileLink} type="video/mp4" />
              </video>
            </Modal>
          </Form>
        </Col>
        <Col span={14}>
          <Item label={t("free_time_table")}>
            <FreeTimeTable t={t} columns={columns} fixedData={fixedData} />
          </Item>
          <Item label={t("note")}>{cvData?.note || t("no_comment")}</Item>
        </Col>
      </Row>
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
            <>
              <Item
                label={answer.question.content}
                required={answer.question.isRequired}
              >
                {answer.content}
              </Item>
            </>
          ))}
        </>
      ) : null}
      <Divider />
      {/* <Button
        onClick={() => setShowCV(!showCV)}
        style={{ marginBottom: "15px" }}
      >
        {showCV ? t("close_cv") : t("show_cv")}
      </Button> */}
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
          <Row>
            <div className="all-page-container">
              {scale}
              {pdfDoc}
            </div>
          </Row>
        </>
      ) : null}
      <ConfirmRejectStatus
        t={t}
        confirmReject={confirmReject}
        setConfirmReject={setConfirmReject}
        formik={formik}
      />
      {cvData.class?._id ? (
        <SetInterviewTime
          t={t}
          confirmInterview={confirmInterview}
          setConfirmInterview={setConfirmInterview}
          interviewData={cvData.schedule}
          formik={formik}
          columns={columns}
          fixedData={fixedData}
          classId={cvData.class._id}
        />
      ) : null}
      <ConfirmPassStatus
        t={t}
        confirmPass={confirmPass}
        setConfirmPass={setConfirmPass}
        formik={formik}
      />
    </div>
  );
}

export default CVDetail;
