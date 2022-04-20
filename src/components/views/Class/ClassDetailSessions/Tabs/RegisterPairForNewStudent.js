import { Button, Form, Input, Radio, Select } from "antd";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { getArrayLength } from "../../../../common/transformData";
import { OFFLINE_OPTION, ONLINE_OPTION } from "../../../../common/constant";
import apis from "../../../../../apis";
import useFetchLocation from "../../../../../hook/CommonData.js/useFetchLocation";

const { Item } = Form;
const { Option } = Select;

function RegisterPairForNewStudent(props) {
  const { t } = useTranslation();
  const [districts, setDistricts] = useState([]);
  const [address, setAddress] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});
  const [teachOption, setTeachOption] = useState(OFFLINE_OPTION);
  const location = useFetchLocation();

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

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const { pairsTeaching, setAddNewStudent } = props;
  const unRegisterStudents = pairsTeaching?.filter((item) => !item.status);
  const formik = useFormik({
    initialValues: {
      student: getArrayLength(unRegisterStudents)
        ? unRegisterStudents[0].student._id
        : "",
    },
    validationSchema: Yup.object({
      //   studentId: Yup.string().required(t("required_lesson_name_message")),
      //   description: Yup.string().required(
      //     t("required_lesson_description_message")
      //   ),
      //   linkOnline: Yup.string().matches(urlRegExp, t("link_is_invalid")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        const valuesToSend = { ...values, address, teachOption };
        alert(JSON.stringify(valuesToSend));
        setSubmitting(false);
        setAddNewStudent(false);
      }, 400);
    },
  });

  return (
    <div>
      <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
        <Item label={t("student_name")} required>
          <Select
            showSearch
            placeholder={t("select_student")}
            onChange={(key) => formik.setFieldValue("student", key)}
            value={
              getArrayLength(unRegisterStudents) === 1
                ? unRegisterStudents[0].student.user.name
                : undefined
            }
          >
            {unRegisterStudents?.map((option) => (
              <Option key={option.student._id} value={option.student._id}>
                {option.student.user.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t("target_student")} required>
          <Input />
        </Item>
        <Item label={t("grade")} required>
          <Input />
        </Item>
        <Item label={t("subject")} required></Item>
        <Item label={t("number_of_lesson_per_week")}></Item>
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
          <div>
            {" "}
            <Item
              label={t("address")}
              className="add-student__input-address-select-form"
            >
              <Select
                showSearch
                placeholder={t("input_province")}
                onChange={handleChangeProvice}
                value={province?.name}
              >
                {location.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
              <Select
                showSearch
                placeholder={t("input_district")}
                value={district?.name}
                onChange={handleChangeDistrict}
                className="add-student__input-address-center-form"
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
                placeholder={t("input_ward")}
                value={ward?.name}
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
                onChange={(e) => handleChangeAddressDescription(e)}
                placeholder={t("input_specific_address")}
              />
            </Item>
            <Item label="note"></Item>
          </div>
        ) : null}
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("register")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default RegisterPairForNewStudent;