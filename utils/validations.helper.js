'use strict';

// LIBRARIES
import _ from 'lodash';
import check from 'check-types';
import validator from 'validator';

// ERRORS
import ApiError from '../errors/ApiError';
import errors from '../errors/errors';

var checkName = function (name) {
  return check.string(name) && validator.isLength(name, 2, 255);
};

var checkPhone = function(phone) {
  return validator.isLength(phone, 2, 45);
}

export function validations(entity){
  if(!entity){
    return new ApiError(errors.bad_request_400.generic_bad_format);
  }

  if(!entity.firstName || !checkName(entity.firstName)){
    return new ApiError(errors.bad_request_400.invalid_first_name);
  }

  if(!entity.lastName || !checkName(entity.lastName)){
    return new ApiError(errors.bad_request_400.invalid_last_name);
  }

  if (!entity.email || !validator.isEmail(entity.email)) {
    return new ApiError(errors.bad_request_400.invalid_email);
  }

  if (entity.phone && !checkPhone(entity.phone)) {
    return new ApiError(errors.bad_request_400.invalid_phone);
  }

  return;
}

export function validationsToUpdate(entity){
  if(!entity){
    return new ApiError(errors.bad_request_400.generic_bad_format);
  }

  if(entity.name && !checkName(entity.name)){
    return new ApiError(errors.bad_request_400.invalid_name);
  }

  if (entity.email && !validator.isEmail(entity.email)) {
    return new ApiError(errors.bad_request_400.invalid_email);
  }

  if (entity.phone && !checkPhone(entity.phone)) {
    return new ApiError(errors.bad_request_400.invalid_phone);
  }

  return;
}

export function userValidations(entity) {
  if(!entity){
    return new ApiError(errors.bad_request_400.generic_bad_format);
  }

  if(entity.status && !_.includes(['active', 'inactive', 'blocked'], entity.status)){
    return new ApiError(errors.bad_request_400.invalid_user_status);
  }

  return;
}
