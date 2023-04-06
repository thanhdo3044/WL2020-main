const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const db = {};
const moment = require("moment");
const { sequelize } = require("../config/config");
const nodemailer = require("nodemailer");
const { query } = require("express");
module.exports = {
  checkProfileAccount: async (req, res) => {
    let result = {};
    let status = 200;
    let dataBody = req.body;
    try {
      let dataSel = await sequelize.query(
        `
            select ACCOUNT,EMAIL from base.ACCOUNT where EMAIL = N'${dataBody.EMAIL}' and ACCOUNT = N'${dataBody.ACCOUNT}'
            `,
        { type: QueryTypes.SELECT }
      );
     
      result.data = dataSel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  //get menu mobile
  get: async (req, res) => {
    let result = {};
    let status = 200;
    let dataBody = req.query.id;
    try {
      let dataSel = await sequelize.query(
        `
            select rv.* ,m.NAME,m.PATH,m.icon,m.species from base.ROLE_VALUE rv 
left join base.MENU m on m.ID = rv.VALUE
where ROLE_ID = ${dataBody} and ROLE_TYPE_ID = 100009
            `,
        { type: QueryTypes.SELECT }
      );
      result.data = dataSel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  //get menu desktop
  getMenuDesk: async (req, res) => {
    let result = {};
    let status = 200;
    let dataBody = req.query.id;
    try {
      let dataSel = await sequelize.query(
        `
            select rv.* ,m.NAME,m.PATH,m.icon,m.PARENT_ID from base.ROLE_VALUE rv 
left join base.MENU m on m.ID = rv.VALUE
where ROLE_ID = ${dataBody} and ROLE_TYPE_ID = 100006
            `,
        { type: QueryTypes.SELECT }
      );
      result.data = dataSel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  }
};
