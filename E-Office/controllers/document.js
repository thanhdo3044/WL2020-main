const { DOCUMENT, data } = require("../models");
const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const db = {};
const moment = require("moment");
const { sequelize } = require("../config/config");

// function validateRequest(value) {
//   const schema = Joi.object({
//     id: Joi.string().required(),
//     parentId: Joi.string(),
//     accountId: Joi.string().required(),
//     fromAccountId: Joi.string().required(),
//     orderId: Joi.string().required(),
//     departmentId: Joi.string().required(),
//     factoryId: Joi.string(),
//     title: Joi.string().required(),
//     status: Joi.string(),
//     position: Joi.string(),
//     name: Joi.string(),
//     showMessages: Joi.boolean(),
//     isDisable: Joi.boolean().required(),
//     completed: Joi.boolean().required(),
//     timeVTAccept: Joi.any(),
//     timeEndAuthority: Joi.any(),
//     timeStartAuthority: Joi.any(),
//     idReqAuthority: Joi.any(),
//     isAuthority: Joi.any(),
//     accountIdAuthorised: Joi.any(),
//     timeStartAuthorised: Joi.any(),
//     timeEndAuthorised: Joi.any(),
//     timeAuthorityActive: Joi.any(),
//     edit: Joi.any(),
//     timeVTAcceptEnd: Joi.any(),
//     successOrder: Joi.any(),
//     star: Joi.any(),
//     accountId2: Joi.any(),
//     accountId2Active: Joi.any()
//   });
//   return schema.validate(value);
// }

// function validateRequestUpdate(value) {
//   const schema = Joi.object({
//     id: Joi.string().required(),
//     status: Joi.string().required(),
//     completed: Joi.boolean().required(),
//     accountId2Active: Joi.any()
//   });
//   return schema.validate(value);
// }

module.exports = {
  get: async (req, res) => {
    let result = {};
    let status = 200;
    let { id } = req.body;
    try {
      let accounts = await DOCUMENT.findAll({
        where: {
          account: req.query.account
        }
      });
      result.data = accounts;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  import: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let document;
      console.log("req.body.item", req.body);
      document = await DOCUMENT.bulkCreate(req.body);
      // for (const data in req.body) {
      //   console.log("data", data);
      //   document = await DOCUMENT.bulkCreate(data);
      // }
      result.data = document;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    console.log(result);
    return res.status(status).send(result);
  },
  backup: async (req, res) => {
    let result = {};
    let status = 200;
    result.data = await data.document;
    return res.status(status).send(result);
  }
};
