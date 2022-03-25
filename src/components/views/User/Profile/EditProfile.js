import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import "./profile.scss";
import { phoneRegExp } from "../../../common/constant";

const { Item } = Form;
const { Option } = Select;

function EditProfile(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [userData, setUserData] = useState({});
  const userId = localStorage.getItem("userId");
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});
  const [address, setAddress] = useState({});

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const formik = useFormik({
    initialValues: userData ? userData : {},
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required(t("required_name_message")),
      email: Yup.string()
        .email(t("invalid_email_message"))
        .required(t("required_email_message")),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, t("invalid_phone_number"))
        .required(t("required_phone_number_message")),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        const valuesToSend = { ...values, address };
        Axios.post(`/api/users/profile/edit`, { userData: valuesToSend }).then(
          (response) => {
            if (response.data.success) {
              history.push("/profile");
            } else {
              alert(t("fail_to_get_api"));
            }
          }
        );
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
    Axios.post(`/api/users/profile`, { userId: userId }).then((response) => {
      if (response.data.success) {
        const data = response.data.userData;
        setUserData(data);
        if (data.address.address) {
          setAddress(data.address);
          setProvince(data.address.address.province);
          setDistrict(data.address.address.district);
          setWard(data.address.address.ward);
        }
      } 
    });
  }, [t, userId]);

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

  const fieldError = (formik) => {
    return (
      !formik.errors.name && !formik.errors.email && !formik.errors.phoneNumber
    );
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile__title">{t("edit_profile")}</div>
      <Form
        {...layout}
        name="control-hooks"
        className="edit-profile__form"
        onSubmit={formik.handleSubmit}
      >
        <Item label={t("user_name")} required>
          <Input
            name="name"
            value={formik.values.name}
            placeholder={t("input_name")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && formik.touched.name && (
            <span className="custom__error-message">{formik.errors.name}</span>
          )}
        </Item>
        <Item label={t("email")} required>
          <Input
            name="email"
            value={formik.values.email}
            placeholder={t("input_email")}
            disabled={true}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <span className="custom__error-message">{formik.errors.email}</span>
          )}
        </Item>
        <Item label={t("phone_number")} required>
          <Input
            name="phoneNumber"
            value={formik.values.phoneNumber}
            placeholder={t("input_phone_number")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <span className="custom__error-message">
              {formik.errors.phoneNumber}
            </span>
          )}
        </Item>
        <Item
          name="address"
          label={t("address")}
          className="edit-profile__input-address-select-form"
        >
          <Select
            value={address.address?.province?.name}
            showSearch
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
            value={address.address?.district?.name}
            showSearch
            placeholder={t("input_district")}
            onChange={handleChangeDistrict}
            className="edit-profile__input-address-center-form"
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
            value={address.address?.ward?.name}
            showSearch
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
            onChange={(e) => handleChangeAddressDescription(e)}
            placeholder={t("input_specific_address")}
          />
        </Item>
        <Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            className={!fieldError(formik) ? "disable-submit-button" : ""}
            disabled={!fieldError(formik)}
          >
            {t("update")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default EditProfile;
