"use strict";

class BadRequestError extends Error {}

class AuthenticationError extends Error {}

class MissingPackageJsonError extends Error {}

exports.BadRequestError = BadRequestError;
exports.AuthenticationError = AuthenticationError;
exports.MissingPackageJsonError = MissingPackageJsonError;
const USER_ERRORS = [BadRequestError, MissingPackageJsonError, AuthenticationError];

exports.isUserError = err => {
  for (const UserError of USER_ERRORS) {
    if (err instanceof UserError) {
      return true;
    }
  }

  return false;
};