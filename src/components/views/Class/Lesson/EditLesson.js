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
import "./lesson.scss";
import {
  WEEKDAY,
  FORMAT_TIME_SCHEDULE,
  OFFLINE_OPTION,
  ONLINE_OPTION,
  urlRegExp,
} from "../../../common/constant";
import { convertDateStringToMoment } from "../../../common/transformData";
import { generateKey } from "../../../common/function";
import { useFormik } from "formik";
import * as Yup from "yup";
import PermissionDenied from "../../Error/PermissionDenied";
import { checkCurrentMonitorBelongToCurrentClass } from "../../../common/checkRole";
import moment from "moment";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import useFetchLocation from "../../../../hook/CommonData.js/useFetchLocation";
import apis from "../../../../apis";
import useFetchClassData from "../../../../hook/Class/useFetchClassData";
import useFetchLessonData from "../../../../hook/Lesson/useFetchLessonData";

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

function EditLesson(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const { id, lessonId } = useParams();
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [defaultSchedule, setDefaultSchedule] = useState({});
  const [time, setTime] = useState({});
  const [address, setAddress] = useState({});
  const [teachOption, setTeachOption] = useState();
  const currentUser = useFetchCurrentUserData();
  const classData = useFetchClassData(id);
  const location = useFetchLocation();
  const lessonData = useFetchLessonData(id, lessonId);

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const fetchDistricts = async (provinceId) => {
    const data = await apis.commonData.getDistricts(provinceId);
    if (data.success) {
      setDistricts(data.districts);
    }
  };

  const fetchWards = async (provinceId, districtId) => {
    const data = await apis.commonData.getWards(provinceId, districtId);
    if (data.success) {
      setWards(data.wards);
    }
  };

  const fetchEditLesson = async (classId, lessonId, dataToSend) => {
    const data = await apis.lessons.editLesson(classId, lessonId, dataToSend);
    if (data.success) {
      history.push(`/classes/${classId}/lessons/${lessonId}`);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  useEffect(() => {
    setTime(lessonData.time);
    setTeachOption(lessonData.teachOption);
    const addressData = lessonData.address;
    if (addressData) {
      setAddress(addressData);
      setProvince(addressData.address?.province);
      setDistrict(addressData.address?.district);
      setWard(addressData.address?.ward);
      fetchDistricts(addressData.address?.province.id);
      fetchWards(
        addressData.address?.province.id,
        addressData.address?.district.id
      );
    }
  }, [lessonData]);

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
        fetchEditLesson(id, lessonId, valuesToSend);
        setSubmitting(false);
      }, 400);
    },
  });

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    fetchDistricts(currentProvince.id);
    setWards([]);
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
    fetchWards(province.id, currentDistrict.id);
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
          endTime: "00:00",
          startTime: "00:00",
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
        value={province?.name}
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
        value={district?.name}
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
        value={ward?.name}
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
            <Col span={10}>
              <DatePicker
                value={convertDateStringToMoment(time.date)}
                onChange={onChangeDate}
                placeholder={t("date_placeholder")}
              />
            </Col>
            <Col span={7}>
              <span className="add-class__from-to-label">{t("from")}</span>
              <TimePicker
                className="add-class__time-picker"
                format={FORMAT_TIME_SCHEDULE}
                value={
                  time && time.endTime
                    ? moment(time.startTime, FORMAT_TIME_SCHEDULE)
                    : undefined
                }
                placeholder={t("time_placeholder")}
                onChange={(e, timeString) =>
                  setTime({ ...time, startTime: timeString })
                }
              />
            </Col>
            <Col span={7}>
              <span className="add-class__from-to-label">{t("to")}</span>
              <TimePicker
                className="add-class__time-picker"
                format={FORMAT_TIME_SCHEDULE}
                value={
                  time && time.endTime
                    ? moment(time.endTime, FORMAT_TIME_SCHEDULE)
                    : undefined
                }
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
