import { Button, Col, Divider, Icon, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getArrayLength } from "../../../../common/transformData";
import RegisterPairForNewStudent from "./RegisterPairForNewStudent";

const { Option } = Select;

function PairManager(props) {
  const { classData } = props;
  const currentClassVolunteer = classData.volunteers;
  const { t } = useTranslation();
  const [editting, setEditting] = useState([]);
  const [addNewStudent, setAddNewStudent] = useState(false);

  const dataSource = classData.pairsTeaching
    ? classData.pairsTeaching.map((item, index) => ({
        key: index,
        id: item._id,
        studentName: item.student.user.name,
        volunteerName: item.volunteer?.user.name,
      }))
    : [];

  useEffect(() => {
    if (getArrayLength(classData.pairsTeaching)) {
      classData.pairsTeaching.map((item, index) =>
        setEditting((editting) => [...editting, (editting[index] = false)])
      );
    }
  }, [classData]);

  const changeEditting = (item) => {
    const edittingRecords = editting.map((edittingRecord, index) => {
      if (index == item.key) return !editting[index];
      else return editting[index];
    });
    setEditting(edittingRecords);
  };

  // const renderPairs = () => {
  //   return dataSource?.map((item) => (
  //     <div>
  //       <Row className="class-detail__pair-record">
  //         <Col span={1}></Col>
  //         <Col span={4}>{item.studentName}</Col>
  //         <Col span={4}>{item.volunteerName}</Col>
  //         <Col span={4}>{item.numberOfLesson || 0}</Col>
  //         <Col span={6}>{t("teach_option")}</Col>
  //         <Col span={2}>
  //           {getArrayLength(showMoreIcon) && showMoreIcon[item.key] ? (
  //             <Button
  //               onClick={() => changeShowMoreStatus(item)}
  //               className="class-detail__pair-record--show-button"
  //             >
  //               {t("close")}
  //               <Icon type="caret-down" />
  //             </Button>
  //           ) : (
  //             <Button
  //               onClick={() => changeShowMoreStatus(item)}
  //               className="class-detail__pair-record--show-button"
  //             >
  //               {t("show_more")}
  //               <Icon type="caret-right" />
  //             </Button>
  //           )}
  //         </Col>
  //         <Table />
  //       </Row>
  //       <hr />
  //     </div>
  //   ));
  // };

  // return (
  //   <div className="class-detail__pairs-table">
  //     <Row className="class-detail__pairs-label">
  //       <Col span={1}></Col>
  //       <Col span={4}>{t("student_name")}</Col>
  //       <Col span={4}>{t("volunteer_incharge")}</Col>
  //       <Col span={4}>{t("number_of_lessons")}</Col>
  //       <Col span={6}>{t("teach_option")}</Col>
  //     </Row>
  //     <hr />
  //     {renderPairs()}
  //   </div>
  // );
  const columns = [
    {
      title: t("student_name"),
      dataIndex: "studentName",
      key: "studentName",
      render: (text) => <span>{text}</span>,
      width: 150,
    },
    {
      title: t("volunteer_incharge"),
      dataIndex: "volunteerName",
      key: "volunteerName",
      render: (text, item) => (
        <span>
          {editting[item.key] ? (
            <Select
              // value={item.dayOfWeek}
              showSearch
              placeholder={t("input_volunteer_incharge")}
              // onChange={(value) =>
              //   setDefaultSchedule(
              //     [...defaultSchedule].map((object) => {
              //       if (object.key === item.key) {
              //         return {
              //           ...object,
              //           dayOfWeek: value,
              //         };
              //       } else return object;
              //     })
              //   )
              // }
              style={{ width: "100%" }}
            >
              {currentClassVolunteer?.map((option) => (
                <Option key={option.key} value={option.key}>
                  {option.user.name}
                </Option>
              ))}
            </Select>
          ) : (
            t("unset")
          )}
        </span>
      ),
      width: 150,
    },
    {
      title: t("teach_option"),
      dataIndex: "teachOption",
      key: "teachOption",
      render: (text, item) => <span>{text}</span>,
      width: 300,
    },
    {
      title: t("number_of_lessons"),
      dataIndex: "numberOfLessons",
      key: "numberOfLessons",
      render: (text) => <span>{text || 0}</span>,
      width: 150,
    },
    {
      title: t("action"),
      dataIndex: "id",
      key: "id",
      render: (text, item) => (
        <span>
          {!editting[item.key] ? (
            <Button onClick={() => changeEditting(item)}>{t("edit")}</Button>
          ) : (
            <>
              <Button>{t("submit")}</Button>
              <Button>{t("cancel")}</Button>
            </>
          )}
        </span>
      ),
      width: 150,
    },
  ];

  return (
    <div className="class-detail__pairs-table">
      <Row>
        <Col span={12} className="class-detail__pairs-table--title">
          {t("pairs_table")}
        </Col>
        <Col span={12} className="class-detail__pairs-table--option-button">
          {addNewStudent ? null : (
            <Button onClick={() => setAddNewStudent(true)} type="primary">
              {t("register_pairs_for_student")}
            </Button>
          )}
        </Col>
      </Row>
      {addNewStudent ? (
        <RegisterPairForNewStudent
          pairsTeaching={classData.pairsTeaching}
          setAddNewStudent={setAddNewStudent}
        />
      ) : (
        <div>
          <Row>
            <Col></Col>
            <Col></Col>
          </Row>
          <Table columns={columns} dataSource={dataSource} />
        </div>
      )}
    </div>
  );
}

export default PairManager;
