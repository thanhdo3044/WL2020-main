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
                INSERT INTO eof.MEETING_ROOM (NAME, TYPE, DESCRIPTION, MAX_PERSON, STATUS, LOCATION, CREATED_BY ,CREATED_AT)
                VALUES (
                    N'${req.body.name}', 
                    '${req.body.type}', 
                    N'${req.body.description}', 
                    ${req.body.maxPerson}, 
                    '${req.body.status}', 
                    N'${req.body.location}',
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
                SELECT ID , NAME, TYPE, DESCRIPTION, MAX_PERSON, STATUS, LOCATION, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.MEETING_ROOM `, { type: QueryTypes.SELECT }
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
                UPDATE eof.MEETING_ROOM
                SET
                NAME = N'${req.body.name}',
                TYPE = '${req.body.type}',
                DESCRIPTION = N'${req.body.description}',
                MAX_PERSON = ${req.body.maxPerson},
                STATUS = '${req.body.status}',
                LOCATION = N'${req.body.location}',
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
                SELECT ID , NAME, TYPE, DESCRIPTION, MAX_PERSON, STATUS, LOCATION, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.MEETING_ROOM WHERE ID = ${req.params.id} `, { type: QueryTypes.SELECT }
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
                DELETE FROM eof.MEETING_ROOM
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

    getByLocation: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let meeting = await sequelize.query(
                `
                SELECT ID , NAME, TYPE, DESCRIPTION, MAX_PERSON, STATUS, LOCATION, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT 
                FROM eof.MEETING_ROOM WHERE LOCATION = '${req.query.location}' `, { type: QueryTypes.SELECT }
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