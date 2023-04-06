// const { machineForm, data, Account } = require("../models");
const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");


module.exports = {


    show: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let machineForm = await sequelize.query(
                `
                select machineId, NAME from prod.FactoryMachine `, { type: QueryTypes.SELECT }
            );
            result.data = machineForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    showItem: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let machineForm = await sequelize.query(
                `
                SELECT ID, NAME FROM base.ITEM `, { type: QueryTypes.SELECT }
            );
            result.data = machineForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    report: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let machineForm = await sequelize.query(
                `
                INSERT INTO prod.ReportFactoryMachine(accountId, machineId, CODE, datetimeIn, factoryId)
                VALUES (${req.body.accountId},'${req.body.machineId}',
                '${req.body.CODE}', '${req.body.startTime}', ${req.body.factoryId})`, { type: QueryTypes.INSERT }
            );
            result.data = machineForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    endTime: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let machineForm = await sequelize.query(
                `
                SELECT id, datetimeIn FROM prod.ReportFactoryMachine WHERE datetimeOut is null `, { type: QueryTypes.SELECT }
            );
            result.data = machineForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    updateQuantityReport: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let machineForm = await sequelize.query(
                `
                UPDATE prod.ReportFactoryMachine SET datetimeOut = '${req.body.datetimeOut}', actualOutput = ${req.body.actualOutput} WHERE id = ${req.body.id}
                `, { type: QueryTypes.UPDATE }
            );
            result.data = machineForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    working: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let machineForm = await sequelize.query(
                `
                select accountId from prod.ReportFactoryMachine where machineId = '${req.query.machineId}' and datetimeOut is null `, { type: QueryTypes.SELECT }
            );
            result.data = machineForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    showReportByAccountId: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let machineForm = await sequelize.query(
                `
                select id, machineId, CODE, datetimeIn from prod.ReportFactoryMachine where accountId = ${req.query.accountId} and datetimeOut is null `, { type: QueryTypes.SELECT }
            );
            result.data = machineForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    }

};