/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { auth } from "../_actions/user_actions";
import { useSelector, useDispatch } from "react-redux";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    useEffect(() => {
      //To know my current status, send Auth request
      dispatch(auth()).then((response) => {
        //Not Loggined in Status
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
          //Loggined in Status
        } else {
          //supposed to be Admin page, but not admin person wants to go inside
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/dashboard");
          }
          //Logged in Status, but Try to go into log in page
          else {
            if (option === false) {
              props.history.push("/dashboard");
            }
          }
        }
        setSuccess(true);
      });
    }, []);

    return <>{success ? <SpecificComponent {...props} user={user} /> : null }</>
  }
  return AuthenticationCheck;
}
