"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListProvidersMonthAvailabilityService = _interopRequireDefault(require("@modules/appointments/services/ListProvidersMonthAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProviderMonthAvailabilityController {
  async index(request, response) {
    const {
      provider_id
    } = request.params;
    const {
      year,
      month
    } = request.query;

    const listProvidersMonthAvailability = _tsyringe.container.resolve(_ListProvidersMonthAvailabilityService.default);

    const availability = await listProvidersMonthAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month)
    });
    return response.json(availability);
  }

}

exports.default = ProviderMonthAvailabilityController;