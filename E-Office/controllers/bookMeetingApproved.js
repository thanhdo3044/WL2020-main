const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");


module.exports = {

    add: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                INSERT INTO eof.BOOK_METTING_APPROVED (BOOKING_ID, ACCOUNT_ID, CREATED_AT)
                VALUES (
                    ${req.body.bookingId}, 
                    ${req.body.accountId}, 
                    GETDATE()) `, { type: QueryTypes.INSERT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getAll: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT ID, TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.BOOK_METTING `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    update: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                UPDATE eof.BOOK_METTING
                SET
                TITLE = N'${req.body.title}',
                CONTENT = N'${req.body.content}',
                DATE_SELECT = '${req.body.dateSelect}',
                START_TIME = '${req.body.startTime}',
                END_TIME = '${req.body.endTime}',
                URL_FILE = N'${req.body.urlFile}',
                URL_LINK = N'${req.body.urlLink}',
                ROOM_ID = ${req.body.roomId},
                UPDATED_BY = ${req.body.accountId},
                UPDATED_AT = '2021-3-3',
                WHERE ID = ${req.params.id} `, { type: QueryTypes.UPDATE }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getById: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT ID, TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.BOOK_METTING WHERE ID = ${req.params.id} `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    delete: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                DELETE FROM eof.BOOK_METTING
                WHERE ID = ${req.params.id} `, { type: QueryTypes.DELETE }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
};