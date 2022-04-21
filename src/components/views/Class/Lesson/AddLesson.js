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
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { generateKey } from "../../../common/function";
import moment from "moment";
import useFetchCurrentUserData from "../../../../hook/User/useFetchCurrentUserData";
import useFetchLocation from "../../../../hook/CommonData.js/useFetchLocation";
import apis from "../../../../apis";
import useFetchClassData from "../../../../hook/Class/useFetchClassData";
import { ONE_2_ONE_TUTORING } from "../../../common/classConstant";

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

function AddLesson(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState({});
  const [defaultSchedule, setDefaultSchedule] = useState({});
  const [lessonData, setLessonData] = useState({});
  const [time, setTime] = useState(null);
  const [teachOption, setTeachOption] = useState(OFFLINE_OPTION);
  const currentUser = useFetchCurrentUserData();
  const location = useFetchLocation();
  const classData = useFetchClassData(id);
  const { setAddLesson, fetchLessonsByPair, pairId,  setLessons} = props;

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

  const fetchAddLesson = async (classId, dataToSend) => {
    const data = await apis.lessons.addLesson(classId, dataToSend);
    if (data.success) {
      history.push(`/classes/${classId}`);
    } else if (!data.success) {
      alert(data.message);
    } else {
      alert("Fail to get api");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      classId: id,
      linkOnline: "",
      time: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("required_lesson_name_message")),
      description: Yup.string().required(
        t("required_lesson_description_message")
      ),
      linkOnline: Yup.string().matches(urlRegExp, t("link_is_invalid")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        let valuesToSend;
        if (teachOption === ONLINE_OPTION) {
          valuesToSend = { ...values, teachOption, address, time, pairId };
        }
        if (teachOption === OFFLINE_OPTION) {
          valuesToSend = { ...values, teachOption, address, time, pairId };
        }
        if (classData.teachingOption === ONE_2_ONE_TUTORING) {
          fetchAddLesson(id, valuesToSend);
          fetchLessonsByPair(pairId);
          setAddLesson(false);
        } else fetchAddLesson(id, valuesToSend);
        setSubmitting(false);
      }, 400);
    },
  });

  // useEffect(() => {
 
    // const addressData = classData.address;
    // if (addressData) {
    //   setAddress({
    //     address: addressData.address,
    //     description: addressData.description,
    //   });
    //   setLessonData({ ...lessonData, address: addressData });
    //   setProvince(addressData.address.province);
    //   setDistrict(addressData.address.district);
    //   setWard(addressData.address.ward);
    //   fetchDistricts(addressData.address.province.id);
    //   fetchWards(
    //     addressData.address.province.id,
    //     addressData.address.district.id
    //   );
    // }
    // return () =>{
    //   setAddLesson(true);
    // }
  // }, []);

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
    const time = classData.defaultSchedule?.find(
      (item) => item.dayOfWeek === key
    );
    setDefaultSchedule(time);
    time
      ? setTime({
          key: time.key,
          date: dateString,
          startTime: time.startTime,
          endTime: time.endTime,
          dayOfWeek: time.dayOfWeek,
        })
      : setTime({
          ...time,
          key: generateKey(),
          dayOfWeek: key,
          date: dateString,
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

  return (
    <div className="add-lesson">
      <Row className="add-lesson__title">
        {t("add_lesson")} - {classData.name}
      </Row>
      <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
        <Item label={t("lesson_name")} required>
          <Input
            placeholder={t("input_lesson_name")}
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && formik.touched.name && (
            <span className="custom__error-message">{formik.errors.name}</span>
          )}
        </Item>
        <Item label={t("description")} required>
          <TextArea
            name="description"
            placeholder={t("input_description")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.description && formik.touched.description && (
            <span className="custom__error-message">
              {formik.errors.description}
            </span>
          )}
        </Item>
        <Item name="teachOption" label={t("teach_option")}>
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
            <Item label={t("link_online")}>
              <Input
                placeholder="input_link"
                name="linkOnline"
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
        <Item name="time" label={t("schedule")}>
          <Col span={8}>
            <DatePicker
              onChange={onChangeDate}
              placeholder={t("date_placeholder")}
            />
          </Col>
          <Col span={2}>{t("from")}</Col>
          <Col span={5}>
            <TimePicker
              format={FORMAT_TIME_SCHEDULE}
              value={
                time && time.startTime
                  ? moment(time.startTime, FORMAT_TIME_SCHEDULE)
                  : undefined
              }
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
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("register")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default AddLesson;
