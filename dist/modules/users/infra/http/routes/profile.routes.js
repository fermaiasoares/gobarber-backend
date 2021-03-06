"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _celebrate = require("celebrate");

var _ensureAuthenticated = _interopRequireDefault(require("@modules/users/infra/http/middlewares/ensureAuthenticated"));

var _ProfileController = _interopRequireDefault(require("@modules/users/infra/http/controllers/ProfileController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const profileRouter = (0, _express.Router)();
const usersController = new _ProfileController.default();
profileRouter.use(_ensureAuthenticated.default);
profileRouter.get('/', usersController.show);
profileRouter.put('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    name: _celebrate.Joi.string().required(),
    email: _celebrate.Joi.string().email().required(),
    old_password: _celebrate.Joi.string(),
    password: _celebrate.Joi.string().min(6),
    password_confirmation: _celebrate.Joi.string().valid(_celebrate.Joi.ref('password'))
  }
}), usersController.update);
var _default = profileRouter;
exports.default = _default;