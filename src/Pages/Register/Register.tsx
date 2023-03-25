import React from "react";
import { NavLink } from "react-router-dom";
import { withFormik, FormikProps } from 'formik';
import styled from "./Register.module.css";
const Register: React.FC = () => {
  return (
    <div className={styled.wrapper}>
      <form className={styled.formRight}>
        <h2 className="text-uppercase">Create Account </h2>
        <div className="row">
          <div className="col-sm-6 mb-3">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              className={styled.inputField}
              required
              // onChange={handleChange}
            />
            {/* <p className="text-danger">{errors.name}</p> */}
          </div>

          <div className="col-sm-6 mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className={styled.inputField}
              required
              // onChange={handleChange}
            />
            {/* <p className="text-danger">{errors.phoneNumber}</p> */}
          </div>
        </div>
        <div className="mb-3">
          <label>Your Email</label>
          <input
            type="email"
            className={styled.inputField}
            name="email"
            required
            // onChange={handleChange}
          />
          {/* <p className="text-danger">{errors.email}</p> */}
        </div>

        <div className="row">
          <div className="col-sm-12 mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              id="pwd"
              className={styled.inputField}
              required
              // onChange={handleChange}
            />
            {/* <p className="text-danger">{errors.password}</p> */}
          </div>
        </div>
        <div className="mb-3">
          <label className="option">
            I agree to the <span>Terms and Conditions</span>
            <input type="checkbox" defaultChecked />
            <span className="checkmark" />
          </label>
        </div>
        <div className={styled.formField}>
          <button type="submit" className="btn btn-outline-danger">
            Create Account
          </button>
        </div>
        <p className="text-success mt-4">
          Already have an account?{" "}
          <NavLink to={"/login"}>
            <button className="btn btn-outline-success ms-4">Login here</button>
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default React.memo(Register);
