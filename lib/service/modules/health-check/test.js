/* eslint-disable global-require */
const contracts = {};

function tests(service) {
  this.service = service;
  this.controller = require('./controller')(service);
  return { controller: this.controller, contracts };
}
module.exports = tests;
