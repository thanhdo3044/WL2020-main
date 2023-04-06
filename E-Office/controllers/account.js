const {
  Order,
  OrderMeta,
  Request,
  Message,
  ProposalForm,
  Department,
  Account,
  data,
} = require("../models");
const Joi = require("@hapi/joi");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes } = require("sequelize");
const moment = require("moment");
const db = {};
const { sequelize } = require("../config/config");

function validateUser(order) {
  const schema = Joi.object({
    // id: Joi.string().required(),
    // accountId: Joi.number().required(),
    // departmentId: Joi.number().required(),
    // proposalFormId: Joi.number().required(),
    // title: Joi.string().required(),
    // status: Joi.string(),
    // completed: Joi.boolean(),
    // factoryId: Joi.number(),
    // slug: Joi.string(),
    // priorityLevel: Joi.any().empty(),
    // computerEquipment: Joi.any().empty(),
    // intendedUse: Joi.any().empty(),
    // activeSeen: Joi.any().empty(),
    // timeSeen: Joi.any().empty()
  });
  return schema.validate(order);
}

module.exports = {
  update: async (req, res) => {
    let result = {};
    let status = 201;
    let { id } = req.query;
    let { email, phoneNumber, phoneExt } = req.body;
    try {
      let dataUpd = await sequelize.query(
        `
            update base.ACCOUNT set EMAIL = N'${email}' , PHONE =N'${phoneNumber}', PHONE_EXT = N'${phoneExt}'  where ID = N'${id}' 
            `,
        { type: QueryTypes.UPDATE }
      );
      result.data = dataUpd;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  updateAccount: async (req, res) => {
    let result = {};
    let status = 201;
    try {
      let accounts = await Account.update(req.body, {
        where: {
            id: req.body.id
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
  get: async (req, res) => {
    let result = {};
    let status = 200;
    let { id } = req.body;
    try {
      let accounts = await Account.findAll({
        where: {
          ID: {
            [OP.in]: id,
          },
        },
        include: [Department],
        order: [["updatedAt", "DESC"]],
      });
      result.data = accounts;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  getAll: async (req, res) => {
    let result = {};
    let status = 200;
    let { id } = req.body;
    try {
      let accounts = await Account.findAll();
      result.data = accounts;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  import: async (req, res) => {
    try {
      req.body.forEach(async (e) => {
        let account = await Account.findAll({ where: { account: e.account } });
        if (account.length == 0) await Account.create(e);
      });
      return res.status(200).send(req.body);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
