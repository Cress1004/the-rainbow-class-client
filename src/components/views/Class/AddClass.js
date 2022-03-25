import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  TimePicker,
  Icon,
  Row,
  Col,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router";
import { WEEKDAY, FORMAT_TIME_SCHEDULE } from "../../common/constant";
import { generateKey } from "../../common/function";
import useFetchRole from "../../../hook/useFetchRole";
import { checkAdminRole } from "../../common/checkRole";
import PermissionDenied from "../Error/PermissionDenied";

const { Option } = Select;
const { TextArea } = Input;
const { Item } = Form;

function AddClass(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const userId = localStorage.getItem("userId");
  const currentUserData = useFetchRole(userId);
  const userRole = currentUserData.userRole;

  const [location, setLocation] = useState([]);
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState({});
  const [defaultSchedule, setDefaultSchedule] = useState([
    {
      key: generateKey(),
      dayOfWeek: undefined,
      startTime: "00:00",
      endTime: "00:00",
    },
  ]);

  const [studentTypes, setStudentTypes] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      studentTypes: "",
    },
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
        if (defaultSchedule.length && !defaultSchedule[0].dayOfWeek)
          valuesToSend = { ...values, address };
        else {
          valuesToSend = { ...values, address, defaultSchedule };
        }
        Axios.post("/api/classes/add-class", valuesToSend).then((response) => {
          if (response.data.success) {
            history.push("/classes");
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

  useEffect(() => {
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } 
    });

    Axios.post("/api/common-data/student-types", null).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } 
    });
  }, [t]);

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

  const addNewDefaultSchedule = () => {
    const newSchedule = {
      key: generateKey(),
      dayOfWeek: undefined,
      startTime: "00:00",
      endTime: "00:00",
    };
    setDefaultSchedule([...defaultSchedule, newSchedule]);
  };

  const deleteDefaultSchedule = (e, key) => {
    const newSchedule = defaultSchedule.filter(
      (schedule) => schedule.key !== key
    );
    setDefaultSchedule(newSchedule);
  };

  const schedule = (
    <>
      {defaultSchedule.map((item) => (
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

  const fieldError = (formik) => {
    return (
      !formik.errors.name &&
      !formik.errors.description &&
      !formik.errors.studentTypes &&
      formik.touched.name &&
      formik.touched.description
    );
  };

  if (!checkAdminRole(userRole)) {
    return <PermissionDenied />;
  }

  return (
    <div className="add-class">
      <div className="add-class__title">{t("add_class")}</div>
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
            <span className="custom__error-message">{formik.errors.name}</span>
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
        <Item label={t("address")}>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              marginRight: "10px",
            }}
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
            onChange={(e) => handleChangeAddressDescription(e)}
          />
        </Item>
        <Item label={t("student_type")} required>
          <Select
            mode="multiple"
            showSearch
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "10px",
            }}
            placeholder={t("input_student_type")}
            onChange={(value) => formik.setFieldValue("studentTypes", value)}
          >
            {studentTypes.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Item>
        <Item name="time" label={t("default_schedule")}>
          {schedule}
        </Item>
        <Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            className={!fieldError(formik) ? "disable-submit-button" : ""}
            disabled={!fieldError(formik)}
          >
            {t("register")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default AddClass;
