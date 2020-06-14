import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: ""
  });

  function onChange(event) {
    const { name, value } = event.target;

    setState(prevValue => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  }

  function onSubmit(event) {
    event.preventDefault();

    const { email, password } = state;

    const user = {
      email,
      password
    };

    console.log(user);
  }
  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">
              Sign in to your DevConnector account
            </p>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Email Address"
                  name="email"
                  value={state.email}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  name="password"
                  value={state.password}
                  onChange={onChange}
                />
              </div>
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
