import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    errors: ""
  });

  function onChange(event) {
    const { name, value } = event.target;

    setState(prevValue => {
      return { ...prevValue, [name]: value };
    });
  }

  function onSubmit(event) {
    event.preventDefault();

    const { name, email, password, password2 } = state;

    const newUser = {
      name,
      email,
      password,
      password2
    };

    axios
      .post("/api/users/register", newUser)
      .then(res => console.log(res.data))
      .catch(err =>
        setState(prevValue => {
          return { ...prevValue, errors: err.response.data };
        })
      )
      .then(() => console.log(state));
  }

  return (
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className={`form-control form-control-lg ${state.errors
                    .name && "is-invalid"}`}
                  placeholder="Name"
                  name="name"
                  value={state.name}
                  onChange={onChange}
                />
                {state.errors.name && (
                  <div className="invalid-feedback">{state.errors.name}</div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className={`form-control form-control-lg ${state.errors
                    .email && "is-invalid"}`}
                  placeholder="Email Address"
                  name="email"
                  value={state.email}
                  onChange={onChange}
                />
                <small className="form-text text-muted">
                  This site uses Gravatar so if you want a profile image, use a
                  Gravatar email
                </small>
                {state.errors.email && (
                  <div className="invalid-feedback">{state.errors.email}</div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className={`form-control form-control-lg ${state.errors
                    .password && "is-invalid"}`}
                  placeholder="Password"
                  name="password"
                  value={state.password}
                  onChange={onChange}
                />
                {state.errors.password && (
                  <div className="invalid-feedback">
                    {state.errors.password}
                  </div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className={`form-control form-control-lg ${state.errors
                    .password2 && "is-invalid"}`}
                  placeholder="Confirm Password"
                  name="password2"
                  value={state.password2}
                  onChange={onChange}
                />
                {state.errors.password2 && (
                  <div className="invalid-feedback">
                    {state.errors.password2}
                  </div>
                )}
              </div>
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
