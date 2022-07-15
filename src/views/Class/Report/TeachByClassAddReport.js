import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  InputNumber,
  message,
  Row,
  Select,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import apis from "../../../apis";
import { generateKey } from "../../../common/function";
import { getArrayLength } from "../../../common/transformData";
const { Option } = Select;

function TeachByClassAddReport(props) {
  const {
    t,
    currentVolunteerData,
    lessons,
    classData,
    setAddReport,
    fetchReportsByVolunteer,
    month,
  } = props;
  const tailLayout = {
    wrapperCol: { offset: 16, span: 8 },
  };

  const [reports, setReports] = useState([
    {
      key: generateKey(),
      lesson: "",
      student: "",
      lessonDescription: "",
      comment: "",
      point: null,
      volunteer: currentVolunteerData?._id,
    },
  ]);

  const addNewReport = () => {
    const newReport = {
      key: generateKey(),
      lesson: "",
      student: "",
      lessonDescription: "",
      comment: "",
      point: null,
      volunteer: currentVolunteerData?._id,
    };
    setReports([...reports, newReport]);
  };

  const deleteReport = (e, key) => {
    const newReports = reports.filter((item) => item.key !== key);
    setReports(newReports);
  };

  const fetchAddReport = async (dataToSend) => {
    const data = await apis.reports.addTeachByClassReport(dataToSend);
    if (data.success) {
      message.success("Save success");
    } else if (!data.success) {
      message.error(data.message);
    } else {
      message.error("Fail to get api");
    }
  };

  const handleSubmit = async () => {
    await fetchAddReport(reports);
    await fetchReportsByVolunteer(currentVolunteerData._id, month);
    setAddReport(false);
  };

  const reportForm = (
    <>
      {reports.map((item, index) => (
        <>
          <Row>
            <Col span={1} style={{ fontWeight: "bolder", display: "inline" }}>
              {`${t("report")} ${index + 1}`}
            </Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={6}>
              {" "}
              <Form.Item label={t("student_name")} required>
                <Select
                  style={{
                    display: "inline-block",
                    width: "100%",
                    marginRight: "10px",
                  }}
                  placeholder={t("input_student")}
                  onChange={(value) =>
                    setReports(
                      [...reports].map((object) => {
                        if (object.key === item.key) {
                          return {
                            ...object,
                            student: value,
                          };
                        } else return object;
                      })
                    )
                  }
                >
                  {classData?.students?.map((option) => (
                    <Option key={option._id} value={option._id}>
                      {option.user?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              {" "}
              <Form.Item label={t("lesson")} required>
                <Select
                  style={{
                    display: "inline-block",
                    width: "100%",
                    marginRight: "10px",
                  }}
                  placeholder={t("input_lesson")}
                  onChange={(value) =>
                    setReports(
                      [...reports].map((object) => {
                        if (object.key === item.key) {
                          return {
                            ...object,
                            lesson: value,
                          };
                        } else return object;
                      })
                    )
                  }
                >
                  {lessons?.map((option) => (
                    <Option key={option._id} value={option._id}>
                      {option.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <Form.Item label={t("input_point")} required>
                <InputNumber
                  onChange={(value) =>
                    setReports(
                      [...reports].map((object) => {
                        if (object.key === item.key) {
                          return {
                            ...object,
                            point: value,
                          };
                        } else return object;
                      })
                    )
                  }
                  min="0"
                  max="10"
                />{" "}
                {t("/10")}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={9}>
              {" "}
              <Form.Item label={t("lesson_description")} required>
                <TextArea
                  className="add-report__note-description"
                  name="lessonDescription"
                  onChange={(e) =>
                    setReports(
                      [...reports].map((object) => {
                        if (object.key === item.key) {
                          return {
                            ...object,
                            lessonDescription: e.target.value,
                          };
                        } else return object;
                      })
                    )
                  }
                  rows="5"
                ></TextArea>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={9}>
              <Form.Item label={t("comment_student")} required>
                <TextArea
                  className="add-report__note-description"
                  name="comment"
                  onChange={(e) =>
                    setReports(
                      [...reports].map((object) => {
                        if (object.key === item.key) {
                          return {
                            ...object,
                            comment: e.target.value,
                          };
                        } else return object;
                      })
                    )
                  }
                  rows="5"
                ></TextArea>
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={2}>
              {getArrayLength(reports) === 1 ? null : (
                <Icon
                  type="close-circle"
                  onClick={(e) => deleteReport(e, item.key)}
                />
              )}
            </Col>
          </Row>
          <Divider />
        </>
      ))}
      <Row style={{ textAlign: "center" }}>
        {" "}
        <Icon type="plus-circle" onClick={addNewReport} />
      </Row>
    </>
  );
  return (
    <div>
      {reportForm}
      <Form.Item {...tailLayout}>
        <Button
          onClick={() => setAddReport(false)}
          style={{ marginRight: "10px" }}
        >
          {t("cancel")}
        </Button>
        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
          {t("register")}
        </Button>
      </Form.Item>
    </div>
  );
}

export default TeachByClassAddReport;
