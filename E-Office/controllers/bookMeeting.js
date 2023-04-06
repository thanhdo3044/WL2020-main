const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");


module.exports = {

    add: async(req, res) => {
        let result = {};
        let status = 200;
        let urlFile = req.body.urlFile ? req.body.urlFile : "";
        let urlLink = req.body.urlLink ? req.body.urlLink : "";
        let roomId = req.body.roomId ? req.body.roomId : null;
        try {
            let meeting = await sequelize.query(
                `
                INSERT INTO eof.BOOK_METTING (TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, NGUOI_CHU_TRI, CREATED_BY, CREATED_AT)
                VALUES (
                    N'${req.body.title}', 
                    N'${req.body.content}', 
                    '${req.body.dateSelect}', 
                    '${req.body.startTime}', 
                    '${req.body.endTime}', 
                    N'${urlFile}', 
                    N'${urlLink}', 
                    ${roomId},
                    ${req.body.nguoiChuTri},
                    ${req.body.accountId},
                    GETDATE())
                SELECT TOP 1 ID FROM eof.BOOK_METTING ORDER BY ID DESC
                    `, { type: QueryTypes.SELECT }
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
                UPDATED_AT = GETDATE()
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
                UPDATE eof.BOOK_METTING
                SET
                STATUS = 'delete'
                WHERE ID = ${req.params.id}`, { type: QueryTypes.DELETE }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getByStartTime: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT ID, TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.BOOK_METTING WHERE ROOM_ID = ${req.query.roomId} AND DATE_SELECT = '${req.query.date}' AND '${req.query.startTime}' BETWEEN START_TIME AND END_TIME `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getByEndTime: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT ID, TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.BOOK_METTING WHERE ROOM_ID = ${req.query.roomId} AND DATE_SELECT = '${req.query.date}'
                AND (START_TIME BETWEEN '${req.query.startTime}' AND '${req.query.endTime}' OR END_TIME BETWEEN '${req.query.startTime}' AND '${req.query.endTime}' OR '${req.query.startTime}' BETWEEN START_TIME AND END_TIME) `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getByDate: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT ID, TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.BOOK_METTING WHERE ROOM_ID = ${req.query.roomId} 
                AND DATE_SELECT = '${req.query.date}' `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getDateBooking: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT DISTINCT DATE_SELECT FROM eof.BOOK_METTING
                WHERE CREATED_BY = ${req.query.accountId} `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getAllDateBooking: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT DISTINCT DATE_SELECT FROM eof.BOOK_METTING BM
                INNER JOIN eof.BOOK_METTING_APPROVED BMA ON BM.ID = BMA.BOOKING_ID
                WHERE BM.CREATED_BY = ${req.query.accountId} OR ACCOUNT_ID = ${req.query.accountId}
                 `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    
    getBookingInDay: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT BM.ID, TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, MR.LOCATION, BM.STATUS, NGUOI_CHU_TRI
                FROM eof.BOOK_METTING BM
                LEFT JOIN eof.MEETING_ROOM MR ON BM.ROOM_ID = MR.ID
                WHERE DATE_SELECT = '${req.query.date}' AND BM.CREATED_BY = ${req.query.accountId}
                `, { type: QueryTypes.SELECT }
            );
            result.data = meeting;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    getAllBookingInDay: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT BM.ID, TITLE, CONTENT, DATE_SELECT, START_TIME, END_TIME, URL_FILE, URL_LINK, ROOM_ID, BM.STATUS, A.LAST_NAME
                FROM eof.BOOK_METTING BM
                INNER JOIN eof.BOOK_METTING_APPROVED BMA ON BM.ID = BMA.BOOKING_ID
                INNER JOIN base.ACCOUNT A ON BM.NGUOI_CHU_TRI = A.ID
                WHERE DATE_SELECT = '${req.query.date}' AND (BMA.ACCOUNT_ID = ${req.query.accountId} OR BM.CREATED_BY = ${req.query.accountId})
                `, { type: QueryTypes.SELECT }
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