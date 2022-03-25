import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { Button, Form, Input, Select, Radio } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { phoneRegExp } from "../../../../common/constant";
import { useFormik } from "formik";
import * as Yup from "yup";
import PermissionDenied from "../../../Error/PermissionDenied";
import useFetchRole from "../../../../../hook/useFetchRole";
import { checkAdminAndMonitorRole } from "../../../../common/function";

const { Option } = Select;
const { Item } = Form;
const ADMIN_ROLE = 4;

function EditVolunteer(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };
  const userData = useFetchRole(userId);
  const userRole = userData.userRole;

  const [volunteerData, setVolunteerData] = useState({});
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState({});
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState({});
  const [province, setProvince] = useState({});
  const [address, setAddress] = useState({});

  const fetchLocation = () => {
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      }
    });
  };

  const fetchDistricts = (provinceId) => {
    Axios.post(`/api/common-data/province/${provinceId}/get-districts`, {
      provinceId: provinceId,
    }).then((response) => {
      if (response.data.success) {
        setDistricts(response.data.districts);
      }
    });
  };

  const fetchWards = (provinceId, districtId) => {
    Axios.post(`/api/common-data/district/${districtId}/get-wards`, {
      provinceId: provinceId,
      districtId: districtId,
    }).then((response) => {
      if (response.data.success) {
        setWards(response.data.wards);
      }
    });
  };

  useEffect(() => {
    fetchLocation();
    Axios.post("/api/volunteers/:id", { id: id, userId: userId }).then(
      (response) => {
        if (response.data.success) {
          const data = response.data.volunteer;
          const address = data.user.address;
          setVolunteerData({
            id: data._id,
            name: data.user.name,
            email: data.user.email,
            gender: data.user.gender,
            address: data.user.address,
            phoneNumber: data.user.phoneNumber,
            role: data.role,
            className: data.user?.class?.name,
            isAdmin: data.isAdmin,
          });
          if (address) {
            setAddress(address);
            if (address.address) {
              setProvince(address.address.province);
              setDistrict(address.address.district);
              setWard(address.address.ward);
              fetchDistricts(address.address.province.id);
              fetchWards(
                address.address.province.id,
                address.address.district.id
              );
            }
          }
        } else {
          alert(t("fail_to_get_api"));
        }
      }
    );
  }, [t, id, userId]);
  const formik = useFormik({
    initialValues: volunteerData ? volunteerData : {},
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
        Axios.post(`/api/volunteers/${id}/edit`, valuesToSend).then(
          (response) => {
            if (response.data.success) {
              history.push(`/volunteers/${id}`);
            } else if (!response.data.success) {
              alert(response.data.message);
            } else {
              alert(t("fail_to_get_api"));
            }
          }
        );
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

  const fieldError = (formik) => {
    return (
      !formik.errors.name && !formik.errors.email && !formik.errors.phoneNumber
    );
  };

  if (!checkAdminAndMonitorRole(userRole)) {
    return <PermissionDenied />;
  }

  return (
    <div className="edit-volunteer">
      <div className="edit-volunteer__title">{t("edit_volunteer")}</div>
      <Form {...layout} name="control-hooks" onSubmit={formik.handleSubmit}>
        <Item label={t("user_name")} required>
          <Input
            name="name"
            placeholder={t("input_name")}
            value={formik.values.name}
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
            placeholder={t("input_email")}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email && (
            <span className="custom__error-message">{formik.errors.email}</span>
          )}
        </Item>
        <Item name="phone_number" label={t("phone_number")} required>
          <Input
            name="phoneNumber"
            placeholder={t("input_phone_number")}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <span className="custom__error-message">
              {formik.errors.phoneNumber}
            </span>
          )}
        </Item>
        <Item name="gender" label={t("gender")}>
          <Radio.Group
            value={formik.values.gender}
            onChange={(e) => formik.setFieldValue("gender", e.target.value)}
          >
            <Radio value={0}>{t("male")}</Radio>
            <Radio value={1}>{t("female")}</Radio>
          </Radio.Group>
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
            value={address.address?.province?.name}
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
            value={address.address?.district?.name}
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
            value={address.address?.ward?.name}
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
        <Item name="class" label={t("class")}>
          <Input
            disabled={true}
            value={
              volunteerData.className ? volunteerData.className : t("unset")
            }
          />
        </Item>
        <Item name="role" label={t("role")}>
          <Radio.Group
            value={volunteerData.isAdmin ? ADMIN_ROLE : volunteerData.role}
            disabled={true}
          >
            <Radio value={1}>{t("volunteer")}</Radio>
            <Radio value={2}>{t("class_monitor")}</Radio>
            <Radio value={3}>{t("sub_class_monitor")}</Radio>
            <Radio value={4}>{t("admin")}</Radio>
          </Radio.Group>
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

export default EditVolunteer;
