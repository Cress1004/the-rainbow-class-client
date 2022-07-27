import { Button, Icon, message, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Document, Page, pdfjs } from "react-pdf";
import { Checkbox } from "antd";
import "video-react/dist/video-react.css";
import {
  CV_STATUS,
  CV_STATUS_NAME,
  NOON_TIME,
  WEEKDAY,
} from "../../common/constant";
import { getArrayLength } from "../../common/transformData";
import { Menu } from "antd";
import { useFormik } from "formik";
import ConfirmRejectStatus from "./Section/ConfirmRejectStatus";
import SetInterviewTime from "./Section/SetInterviewTime";
import ConfirmPassStatus from "./Section/ConfirmPassStatus";
import CVBasicInfo from "./Section/CVBasicInfo";
import apis from "../../apis";
import BasicModalConfirm from "../../components/custom/modal/BasicModalConfirm";
import CVNote from "./Section/CVNote";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { TabPane } = Tabs;
const MAX_SCALE = 2.1;
const MIN_SCALE = 0.5;
const SCALE_STEP = 0.1;

function CVDetail(props) {
  const { t } = useTranslation();
  const rightLayout = {
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
  };
  const leftLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
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
  const [showVideo, setShowVideo] = useState(false);
  const [isDuplicateMail, setIsDuplicateMail] = useState(false);
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
      setIsDuplicateMail(data.duplicateMail);
      message.success("Mail was sent to user!");
    } else if (!data.success) {
      message.error(data.message);
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
      date: cvData.schedule?.time?.date,
      startTime: cvData.schedule?.time?.startTime,
      endTime: cvData.schedule?.time?.endTime,
      participants: cvData.schedule?.participants?.map((item) => item._id),
      linkOnline: cvData.schedule?.linkOnline,
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(async () => {
        await fetchUpdateCVStatus(id, values);
        await setSubmitting(false);
      }, 400);
    },
  });

  const columns = [
    {
      title: "",
      dataIndex: "time",
      fixed: true,
      width: 100,
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
      <Tabs defaultActiveKey="1">
        <TabPane tab={t("cv_basic_tab")} key="cv-basic-tab">
          <CVBasicInfo
            leftLayout={leftLayout}
            t={t}
            cvData={cvData}
            columns={columns}
            fixedData={fixedData}
            rightLayout={rightLayout}
            cvStatus={cvStatus}
            setConfirmInterview={setConfirmInterview}
            showCV={showCV}
            showVideo={showVideo}
            setShowCV={setShowCV}
            setShowVideo={setShowVideo}
            answers={answers}
            viewCVAnswer={viewCVAnswer}
            setViewCVAnswer={setViewCVAnswer}
            statusMenuList={statusMenuList}
            pdfDoc={pdfDoc}
            scale={scale}
            downloadFile={downloadFile}
            checkCVDataStatus={checkCVDataStatus}
          />
        </TabPane>
        <TabPane tab={t("cv_note_tab")} key="cv-note-tab">
          <CVNote t={t} cvId={id}/>
        </TabPane>
      </Tabs>
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
          linkOnline={cvData.schedule?.linkOnline}
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
      <BasicModalConfirm
        handleOk={() => setIsDuplicateMail(false)}
        handleCancel={() => setIsDuplicateMail(false)}
        title={t("alert_duplicate_email_modal_title")}
        content={t("alert_duplicate_email_modal_content")}
        visible={isDuplicateMail}
      />
    </div>
  );
}

export default CVDetail;
