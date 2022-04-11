import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  TimePicker,
  Icon,
  Radio,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateKey } from "../../common/function";
import { WEEKDAY, FORMAT_TIME_SCHEDULE } from "../../common/constant";
import { checkCurrentMonitorBelongToCurrentClass } from "../../common/checkRole";
import PermissionDenied from "../Error/PermissionDenied";
import moment from "moment";
import useFetchCurrentUserData from "../../../hook/User/useFetchCurrentUserData";
import useFetchLocation from "../../../hook/CommonData.js/useFetchLocation";
import useFetchStudentTypes from "../../../hook/CommonData.js/useFetchStudentTypes";
import apis from "../../../apis";
import useFetchClassData from "../../../hook/Class/useFetchClassData";
import common from "../../common";
import { ONE_2_ONE_TUTORING } from "../../common/classConstant";

const { TextArea } = Input;
const { Option } = Select;
const { Item } = Form;

function EditClass(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };
  const { id } = useParams();
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [province, setProvince] = useState({});
  const [defaultSchedule, setDefaultSchedule] = useState([]);
  const [address, setAddress] = useState({});
  const currentUser = useFetchCurrentUserData();
  const location = useFetchLocation();
  const studentTypes = useFetchStudentTypes();
  const classData = useFetchClassData(id);

  const fetchDistricts = async (provinceId) => {
    const data = await apis.commonData.getDistricts(provinceId);
    if (data.success) {
      setDistricts(data.districts);
    }
  };

  const fetchEditClass = async (classId, dataToSend) => {
    const data = await apis.classes.editClass(classId, dataToSend);
    if (data.success) {
      history.push(`/classes/${id}`);
    } else if (!data.success) {
      alert(data.message);
    }
  };

  const fetchWards = async (provinceId, districtId) => {
    const data = await apis.commonData.getWards(provinceId, districtId);
    if (data.success) {
      setWards(data.wards);
    }
  };

  const formik = useFormik({
    initialValues: classData ? classData : {},
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required(t("required_class_name_message")),
      description: Yup.string().required(
        t("required_class_description_message")
      ),
      studentTypes: Yup.array().required(t("required_studentType_message")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        let valuesToSend;
        if (defaultSchedule?.length && !defaultSchedule[0].dayOfWeek)
          valuesToSend = { ...values, address };
        else {
          valuesToSend = { ...values, address, defaultSchedule };
        }
        fetchEditClass(id, valuesToSend);
        setSubmitting(false);
      }, 400);
    },
  });

  useEffect(() => {
    const addressData = classData.address;
    if (classData.teachingOption !== ONE_2_ONE_TUTORING) {
      if (addressData) {
        setAddress(addressData);
        setProvince(addressData.address.province);
        setDistrict(addressData.address.district);
        setWard(addressData.address.ward);
        fetchDistricts(addressData.address.province.id);
        fetchWards(
          addressData.address.province.id,
          addressData.address.district.id
        );
      }
      setDefaultSchedule(classData.defaultSchedule);
    }
  }, [classData]);

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

  const addNewDefaultSchedule = () => {
    const newSchedule = {
      key: generateKey(),
      dayOfWeek: undefined,
      startTime: undefined,
      endTime: undefined,
    };
    setDefaultSchedule([...defaultSchedule, newSchedule]);
  };

  const deleteDefaultSchedule = (e, key) => {
    const newSchedule = defaultSchedule.filter(
      (schedule) => schedule.key !== key
    );
    setDefaultSchedule(newSchedule);
  };

  const changeStudentType = (value) => {
    const oldData = formik.values.studentTypes;
    const newData = studentTypes.filter((item) => value.includes(item._id));
    formik.setFieldValue("studentTypes", newData);
  };

  const schedule = (
    <>
      {defaultSchedule &&
        defaultSchedule.map((item) => (
          <Row>
            <Col span={8}>
              <Select
                value={item.dayOfWeek}
                showSearch
                placeholder={t("input_weekday")}
                onChange={(value) =>
                  setDefaultSchedule(
                    [...defaultSchedule].map((object) => {
                      if (object.key === item.key) {
                        return {
                          ...object,
                          dayOfWeek: value,
                        };
                      } else return object;
                    })
                  )
                }
              >
                {WEEKDAY.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.text}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={2}>{t("from")}</Col>
            <Col span={5}>
              <TimePicker
                format={FORMAT_TIME_SCHEDULE}
                defaultValue={moment(item.startTime, FORMAT_TIME_SCHEDULE)}
                placeholder={t("time_placeholder")}
                onChange={(e, timeString) =>
                  setDefaultSchedule(
                    [...defaultSchedule].map((object) => {
                      if (object.key === item.key) {
                        return {
                          ...object,
                          startTime: timeString,
                        };
                      } else return object;
                    })
                  )
                }
              />
            </Col>
            <Col span={2}>{t("to")}</Col>
            <Col span={5}>
              <TimePicker
                format={FORMAT_TIME_SCHEDULE}
                defaultValue={moment(item.endTime, FORMAT_TIME_SCHEDULE)}
                placeholder={t("time_placeholder")}
                onChange={(e, timeString) =>
                  setDefaultSchedule(
                    [...defaultSchedule].map((object) => {
                      if (object.key === item.key) {
                        return {
                          ...object,
                          endTime: timeString,
                        };
                      } else return object;
                    })
                  )
                }
              />
            </Col>
            <Col span={2}>
              <Icon
                type="close-circle"
                onClick={(e) => deleteDefaultSchedule(e, item.key)}
              />
            </Col>
          </Row>
        ))}
      <Icon type="plus-circle" onClick={addNewDefaultSchedule} />
    </>
  );

  if (!checkCurrentMonitorBelongToCurrentClass(currentUser, id)) {
    return <PermissionDenied />;
  }

  return (
    <div className="edit-class">
      <div className="edit-class__title">{t("edit_class")}</div>
      {classData && (
        <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
          <Item label={t("class_name")} required>
            <Input
              name="name"
              placeholder={t("input_class_name")}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />{" "}
            {formik.errors.name && formik.touched.name && (
              <span className="custom__error-message">
                {formik.errors.name}
              </span>
            )}
          </Item>
          <Item label={t("description")} required>
            <TextArea
              name="description"
              placeholder={t("input_description")}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.description && formik.touched.description && (
              <span className="custom__error-message">
                {formik.errors.description}
              </span>
            )}
          </Item>
          <Item label={t("teachingOption")}>
            <Radio.Group value={classData.teachingOption} disabled>
              <Radio value={common.classConstant.TEACH_BY_CLASS}>
                {t("teach_by_class")}
              </Radio>
              <Radio value={common.classConstant.ONE_2_ONE_TUTORING}>
                {t("one_2_one_tutoring")}
              </Radio>
            </Radio.Group>
          </Item>
          <Item name="studentType" label={t("student_type")} required>
            <Select
              mode="multiple"
              showSearch
              style={{
                display: "inline-block",
                width: "100%",
                marginRight: "10px",
              }}
              value={formik.values.studentTypes?.map((item) => item._id)}
              placeholder={t("input_student_type")}
              onChange={(value) => changeStudentType(value)}
            >
              {studentTypes.map((option) => (
                <Option key={option._id} value={option._id}>
                  {option.title}
                </Option>
              ))}
            </Select>
          </Item>
          {classData.teachingOption !== ONE_2_ONE_TUTORING ? (
            <>
              <Item label={t("address")}>
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
                  value={address.description}
                  placeholder={t("input_specific_address")}
                  onChange={(e) => handleChangeAddressDescription(e)}
                />
              </Item>
              <Item name="time" label={t("default_schedule")}>
                {schedule}
              </Item>
            </>
          ) : null}
          <Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {t("update")}
            </Button>
          </Item>
        </Form>
      )}
    </div>
  );
}

export default EditClass;
