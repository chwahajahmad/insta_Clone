import React, { useState, useEffect } from "react";
import style from "../../LogOutScreen/LogoutStyle.module.css";
import { Link } from "react-router-dom";
import img from "../../../static/img/instaLogo.png";
import { signupUser } from "../../../Redux/Actions/auth";
import { useDispatch, useSelector } from "react-redux";
import loader from "../../../static/img/loader.gif";
import { Redirect } from "react-router-dom";
import { generateKeywords } from "./keywordGenerator";
function SignUp() {
  const dispatch = useDispatch();
  const signupError = useSelector(state => state.auth.signupError);
  const isSigningUp = useSelector(state => state.auth.isSigningUp);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const initState = {
    email: "",
    fullName: "",
    userName: "",
    password: "",
  };
  const [user, setUser] = useState(initState);
  const [isValidForm, setIsValidForm] = useState(false);

  const isValid = data => {
    var format = /^([a-zA-Z0-9_-]+)$/;
    var formatForName = /^[a-zA-Z\s]+$/;

    if (
      format.test(data.userName) &&
      formatForName.test(data.fullName) &&
      data.fullName.includes(" ")
    ) {
      setIsValidForm(true);
    } else {
      setIsValidForm(false);
    }
  };
  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    isValid(user);
  }, [user]);

  const handleSubmit = e => {
    e.preventDefault();
    const { email, password, fullName, userName } = user;
    let keywords = fullName.toLowerCase().split(" ");
    if (keywords.length === 1) {
      keywords = [...keywords, "", "", ""];
    }
    if (keywords.length === 2) {
      keywords = [keywords[0], "", keywords[1], ""];
    } else if (keywords.length === 3) {
      keywords = [...keywords, ""];
    }
    keywords = generateKeywords(keywords);
    dispatch(signupUser(email, password, fullName, userName, keywords));
  };

  if (isAuthenticated) {
    return <Redirect to="/"></Redirect>;
  }

  return (
    <div className={style.signInMainWrapper}>
      <div className={style.signInInnerWrapper}>
        <div className={style.logInForm}>
          <div className={style.logoTextDiv}>
            <img alt="" className={style.logoText} src={img} />
          </div>
          <h2 className={style.subHeading}>
            Sign up to see photos and videos from your friends.
          </h2>
          <form
            className={style.loginForm}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              className={style.input}
              id="email"
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="off"
              required
            />
            <input
              className={style.input}
              id="full_name"
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              autoComplete="off"
              required
            />
            <input
              className={style.input}
              id="user_name"
              type="text"
              name="userName"
              value={user.userName}
              onChange={handleChange}
              placeholder="Username"
              autoComplete="off"
              required
            />

            <input
              className={style.input}
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="off"
              required
            />
            <button type="submit" className={style.btn} disabled={!isValidForm}>
              Sign Up
              {isSigningUp && (
                <img
                  src={loader}
                  className={style.loaderStyle}
                  alt=""
                  width="16"
                  height="16"
                />
              )}
            </button>

            {signupError !== "" && (
              <p className={style.errorMsg}>{signupError}</p>
            )}
          </form>
        </div>
        <div className={style.signUpDiv}>
          <span>Dont have a account? </span>
          <Link to="/" className={style.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
