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
    insert: async(req, res) => {
        let result = {};
        let status = 200;
        let dataBody = req.body;
        try {
            let dataSel = await sequelize.query(
                `
            select * from eof.Notification where accountId = ${dataBody.accountId}
            `, { type: QueryTypes.SELECT }
            );
            console.log("dataSel", dataSel);
            let countTokenFCM = 0;
            let dataIns = null;
            dataSel.forEach(async e => {
                if (e.tokenFCM == dataBody.tokenFCM) {
                    countTokenFCM++;
                }
            });
            if (countTokenFCM > 0) {} else {
                dataIns = await sequelize.query(
                    `
            insert into eof.Notification ([accountId],[tokenFCM]) values(${dataBody.accountId},N'${dataBody.tokenFCM}')
            `, { type: QueryTypes.INSERT }
                );
            }
            result.data = dataIns;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },

    //get menu mobile
    get: async(req, res) => {
        let result = {};
        let status = 200;
        let dataBody = req.query.id;
        try {
            let dataSel = await sequelize.query(
                `
            select rv.* ,m.NAME,m.PATH,m.icon,m.species from base.ROLE_VALUE rv 
left join base.MENU m on m.ID = rv.VALUE
where ROLE_ID = ${dataBody} and ROLE_TYPE_ID = 100009 and m.isActive = 1
            `, { type: QueryTypes.SELECT }
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
    getMenuDesk: async(req, res) => {
        let result = {};
        let status = 200;
        let dataBody = req.query.id;
        try {
            let dataSel = await sequelize.query(
                `
            select rv.* ,m.NAME,m.PATH,m.icon,m.PARENT_ID from base.ROLE_VALUE rv 
left join base.MENU m on m.ID = rv.VALUE
where ROLE_ID = ${dataBody} and ROLE_TYPE_ID = 100006
            `, { type: QueryTypes.SELECT }
            );
            result.data = dataSel;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }
        return res.status(status).send(result);
    },
    getMenuMobile: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let dataSel = await sequelize.query(
                `
                SELECT ID id, NAME, PATH, permission, species, isActive FROM base.MENU WHERE [TYPE] = 'mobile'
            `, { type: QueryTypes.SELECT }
            );
            result.data = dataSel;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }
        return res.status(status).send(result);
    },
    getMenuMobileThongTin: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let dataSel = await sequelize.query(
                `
                SELECT ID id, NAME, PATH, species, isActive FROM base.MENU WHERE [TYPE] = 'mobile' and species = '6         ' and isActive = 1 order by id
            `, { type: QueryTypes.SELECT }
            );
            result.data = dataSel;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }
        return res.status(status).send(result);
    },
    addMenuMobile: async(req, res) => {
        let result = {};
        let status = 200;
        let name = req.body.name;
        let path = req.body.path;
        let type = req.body.type;
        let permission = req.body.permission;
        let species = req.body.species;
        let isActive = req.body.isActive;
        if(permission){
            permission = 1
        }else{
            permission = 0
        }
        if(isActive){
            isActive = 1
        }else{
            isActive = 0
        }
        try {
            let dataSel = await sequelize.query(
                `
                INSERT INTO base.MENU (NAME, PATH, TYPE, permission, species, isActive)
                VALUES(N'${name}','${path}', '${type}', ${permission}, '${species}', ${isActive})
                SELECT ID id FROM base.MENU WHERE PATH = '${path}'
            `, { type: QueryTypes.SELECT }
            );
            result.data = dataSel;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }
        return res.status(status).send(result);
    },
    updateMenuMobile: async(req, res) => {
        let result = {};
        let status = 200;
        let NAME = req.body.NAME;
        let PATH = req.body.PATH;
        let id = req.body.id;
        let permission = req.body.permission;
        let species = req.body.species;
        let isActive = req.body.isActive;
        if(permission){
            permission = 1
        }else{
            permission = 0
        }
        if(isActive){
            isActive = 1
        }else{
            isActive = 0
        }
        try {
            let dataSel = await sequelize.query(
                `
                UPDATE base.MENU
                SET NAME = N'${NAME}', PATH = '${PATH}', permission = ${permission}, species = '${species}', isActive = ${isActive}
                WHERE ID = ${id}
            `, { type: QueryTypes.UPDATE }
            );
            result.data = dataSel;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }
        return res.status(status).send(result);
    },
};