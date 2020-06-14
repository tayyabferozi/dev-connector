const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 40 characters";
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "URL is invalid";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.website = "URL is invalid";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.website = "URL is invalid";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.website = "URL is invalid";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.website = "URL is invalid";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.website = "URL is invalid";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
