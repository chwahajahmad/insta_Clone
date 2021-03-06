import React from "react";
import { Route, Redirect } from "react-router-dom";
import Header from "./LogInScreen/Header/Header";
import Loader from "./LogInScreen/Loader/Loader";
import SetupProfile from "../Components/LogOutScreen/SignUp/SignUpSetup";
const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  isVerifying,
  retrieveSuccess,
  isNewUser,
  isHeader = true,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isVerifying ? (
        <div />
      ) : isAuthenticated ? (
        <>
          {retrieveSuccess ? (
            <>
              {isNewUser.personalData.isNewUser ? (
                <SetupProfile />
              ) : (
                <>
                  {isHeader && <Header {...props}></Header>}
                  <Component {...props} {...rest} />
                </>
              )}
            </>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default ProtectedRoute;
