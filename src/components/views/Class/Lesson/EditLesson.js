import React, { useEffect, useState } from "react";
import {
  Row,
  Form,
  Select,
  Input,
  Button,
  Radio,
  DatePicker,
  TimePicker,
  Col,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "./lesson.scss";
import {
  WEEKDAY,
  FORMAT_TIME_SCHEDULE,
  OFFLINE_OPTION,
  ONLINE_OPTION,
  urlRegExp,
} from "../../../common/constant";
import {
  convertDateStringToMoment,
} from "../../../common/transformData";
import { generateKey } from "../../../common/function";
import { useFormik } from "formik";
import * as Yup from "yup";
import useFetchRole from "../../../../hook/useFetchRole";
import PermissionDenied from "../../Error/PermissionDenied";
import { checkCurrentMonitorBelongToCurrentClass } from "../../../common/checkRole";
import moment from "moment";

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

function EditLesson(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const { id, lessonId } = useParams();
  const [location, setLocation] = useState([]);
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [defaultSchedule, setDefaultSchedule] = useState({});
  const [classData, setClassData] = useState({});
  const [lessonData, setLessonData] = useState({});
  const [time, setTime] = useState({});
  const [address, setAddress] = useState({});
  const [teachOption, setTeachOption] = useState();
  const userId = localStorage.getItem("userId");
  const currentUser = useFetchRole(userId);
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  useEffect(() => {
    Axios.post(`/api/classes/${id}`, { classId: id }).then((response) => {
      if (response.data.success) {
        const data = response.data.classData;
        setClassData(data);
      } 
    });
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } 
    });
    Axios.post(`/api/classes/${id}/lessons/${lessonId}`, {
      userId: userId,
      lessonId: lessonId,
    }).then((response) => {
      if (response.data.success) {
        const data = response.data.lessonData;
        setLessonData({
          _id: data._id,
          scheduleId: data.schedule._id,
          teachOption: data.schedule.teachOption,
          linkOnline: data.schedule.linkOnline,
          title: data.title,
          description: data.description,
          address: data.schedule.address,
          time: data.schedule.time,
          // paticipants: data.schedule.paticipants,
        });
        setTime(data.schedule.time);
        setTeachOption(data.schedule.teachOption);
        if (data.schedule.address) {
          setAddress(data.schedule.address);
          setProvince(data.schedule.address.address.province);
          setDistrict(data.schedule.address.address.district);
          setWard(data.schedule.address.address.ward);
        }
      } 
    });
  }, [t, id, lessonId]);

  const formik = useFormik({
    initialValues: {
      title: lessonData.title,
      description: lessonData.description,
      classId: id,
      _id: lessonId,
      scheduleId: lessonData.scheduleId,
      linkOnline: lessonData.linkOnline,
      time: lessonData.time,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required(t("required_lesson_name_message")),
      description: Yup.string().required(
        t("required_lesson_description_message")
      ),
      linkOnline: Yup.string().matches(urlRegExp, t("link_is_invalid")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        let valuesToSend;
        if (teachOption === ONLINE_OPTION) {
          valuesToSend = { ...values, teachOption, time };
        }
        if (teachOption === OFFLINE_OPTION) {
          valuesToSend = { ...values, teachOption, address, time };
        }
        Axios.post(`/api/classes/${id}/lessons/${lessonId}/edit`, {
          lessonData: valuesToSend,
        }).then((response) => {
          if (response.data.success) {
            history.push(`/classes/${id}`);
          } else if (!response.data.success) {
            alert(response.data.message);
          } else {
            alert(t("fail_to_get_api"));
          }
        });
        setSubmitting(false);
      }, 400);
    },
  });

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    setDistricts(currentProvince.districts);
    setDistrict({});
    setWard({});
    setAddress({
      ...address,
      address: {
        province: {
          id: currentProvince.id,
          name: currentProvince.name,
        },
      },
    });
  };

  const handleChangeDistrict = (value) => {
    const currentDistrict = districts.find((item) => value === item.id);
    setDistrict({ id: currentDistrict.id, name: currentDistrict.name });
    setWards(currentDistrict.wards);
    setWard({});
    setAddress({
      ...address,
      address: {
        province: address.address.province,
        district: {
          id: currentDistrict.id,
          name: currentDistrict.name,
        },
      },
    });
  };

  const handleChangeWard = (value) => {
    const currentWard = wards.find((item) => value === item.id);
    setWard({ id: currentWard.id, name: currentWard.name });
    setAddress({
      ...address,
      address: {
        province: address.address.province,
        district: address.address.district,
        ward: {
          id: currentWard.id,
          name: currentWard.name,
        },
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setAddress({
      ...address,
      description: e.target.value,
    });
  };

  const onChangeDate = (e, dateString) => {
    const dayOfWeek = e._d.toString().split(" ")[0];
    const key = WEEKDAY.find((item) => item.value === dayOfWeek).key;
    const newTime = classData.defaultSchedule.find(
      (item) => item.dayOfWeek === key
    );
    setDefaultSchedule(newTime);
    newTime
      ? setTime({
          key: newTime.key,
          date: dateString,
          startTime: newTime.startTime,
          endTime: newTime.endTime,
          dayOfWeek: newTime.dayOfWeek,
        })
      : setTime({
          ...time,
          key: generateKey(),
          date: dateString,
          dayOfWeek: key,
          endTime: undefined,
          startTime: undefined,
        });
  };

  const offlineAddress = (
    <Item name="add-lesson__offline-address" label={t("address")}>
      <Select
        showSearch
        style={{
          display: "inline-block",
          width: "calc(33% - 12px)",
          marginRight: "10px",
        }}
        value={province ? province.name : undefined}
        placeholder={t("input_province")}
        onChange={handleChangeProvice}
      >
        {location.map((option) => (
          <Option key={option._id} value={option.id}>
            {option.name}
          </Option>
        ))}
      </Select>
      <Select
        showSearch
        style={{
          display: "inline-block",
          width: "calc(33% - 12px)",
          margin: "0px 10px",
        }}
        value={district ? district.name : undefined}
        placeholder={t("input_district")}
        onChange={handleChangeDistrict}
      >
        {districts.length
          ? districts.map((option) => (
              <Option key={option._id} value={option.id}>
                {option.name}
              </Option>
            ))
          : null}
      </Select>
      <Select
        showSearch
        style={{
          display: "inline-block",
          width: "calc(33% - 12px)",
          marginLeft: "10px",
        }}
        value={ward ? ward.name : undefined}
        placeholder={t("input_ward")}
        onChange={handleChangeWard}
      >
        {wards.length
          ? wards.map((option) => (
              <Option key={option._id} value={option.id}>
                {option.name}
              </Option>
            ))
          : null}
      </Select>
      <Input
        placeholder={t("input_specific_address")}
        value={address.description}
        onChange={(e) => handleChangeAddressDescription(e)}
      />
    </Item>
  );
  if (!checkCurrentMonitorBelongToCurrentClass(currentUser, id)) {
    return <PermissionDenied />;
  }

  return (
    <div className="add-lesson">
      <Row className="add-lesson__title">
        {t("edit_lesson")} - {classData.name}
      </Row>
      <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
        <Item label={t("lesson_name")} required>
          <Input
            name="title"
            value={formik.values.title}
            placeholder={t("input_lesson_name")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.title && formik.touched.title && (
            <span className="custom__error-message">{formik.errors.title}</span>
          )}
        </Item>
        <Item label={t("description")} required>
          <TextArea
            name="description"
            value={formik.values.description}
            placeholder={t("input_description")}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          {formik.errors.description && formik.touched.description && (
            <span className="custom__error-message">
              {formik.errors.description}
            </span>
          )}
        </Item>
        <Item label={t("teach_option")}>
          <Radio.Group
            value={teachOption}
            onChange={(e) => setTeachOption(e.target.value)}
          >
            <Radio value={OFFLINE_OPTION}>{t("offline")}</Radio>
            <Radio value={ONLINE_OPTION}>{t("online")}</Radio>
          </Radio.Group>
        </Item>
        {teachOption === OFFLINE_OPTION ? (
          <div>{offlineAddress}</div>
        ) : (
          <div>
            <Item label={t("link_online")} required>
              <Input
                placeholder="input_link"
                name="linkOnline"
                value={formik.values.linkOnline}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.linkOnline && (
                <span className="custom__error-message">
                  {formik.errors.linkOnline}
                </span>
              )}
            </Item>
          </div>
        )}
        {time && (
          <Item name="time" label={t("schedule")} required>
            <Col span={8}>
              <DatePicker
                value={convertDateStringToMoment(time.date)}
                onChange={onChangeDate}
                placeholder={t("date_placeholder")}
              />
            </Col>
            <Col span={2}>{t("from")}</Col>
            <Col span={5}>
              <TimePicker
                format={FORMAT_TIME_SCHEDULE}
                value={time && time.endTime ? moment(time.startTime, FORMAT_TIME_SCHEDULE) : undefined}
                placeholder={t("time_placeholder")}
                onChange={(e, timeString) =>
                  setTime({ ...time, startTime: timeString })
                }
              />
            </Col>
            <Col span={2}>{t("to")}</Col>
            <Col span={5}>
              <TimePicker
                format={FORMAT_TIME_SCHEDULE}
                value={time && time.endTime ? moment(time.endTime, FORMAT_TIME_SCHEDULE) : undefined}
                placeholder={t("time_placeholder")}
                onChange={(e, timeString) =>
                  setTime({ ...time, endTime: timeString })
                }
              />
            </Col>
          </Item>
        )}
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("update")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default EditLesson;
