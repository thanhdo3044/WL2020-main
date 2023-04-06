const { UserRegistration, data, OrderMeta, Account, CalendarWork } = require("../models");
const Joi = require("@hapi/joi");
const mssql = require('mssql')

function validateUserRegistration(value) {
    const schema = Joi.object({
        id: Joi.string(),
        accountId: Joi.string().required(),
        orderMetaId: Joi.string(),
        calendarWorkId: Joi.number()
    });
    return schema.validate(value);
}

module.exports = {
    delete: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let userRegistration = await UserRegistration.findOne({
                where: {
                    orderMetaId: req.body.orderMetaId,
                    accountId: req.body.accountId
                }
            });
            if (userRegistration === null) {
                status = 400;
            } else {
                let affectedRows = await UserRegistration.destroy({
                    where: {
                        // criteria
                        accountId: req.body.accountId,
                        orderMetaId: req.body.orderMetaId
                    }
                });
                result.data = affectedRows;
            }
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },
    deleteCalendarWorkId: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let userRegistration = await UserRegistration.findOne({
                where: {
                    accountId: req.body.accountId,
                    calendarWorkId: req.body.calendarWorkId
                }
            });
            if (userRegistration === null) {
                status = 400;
            } else {
                let affectedRows = await UserRegistration.destroy({
                    where: {
                        // criteria
                        accountId: req.body.accountId,
                        calendarWorkId: req.body.calendarWorkId
                    }
                });
                result.data = affectedRows;
            }
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },


    add: async(req, res) => {
        let result = {};
        let status = 201;

        let { error, value } = validateUserRegistration(req.body);

        if (error) {
            console.log('abc');
            status = 500;
            result.status = status;
            result.error = error;
            return res.status(status).send(result);
        }
        let dataSave = await UserRegistration.findOne({
            where: {
                orderMetaId: req.body.orderMetaId,
                accountId: req.body.accountId
            }
        });
        if (dataSave) {
            console.log('abc3');
            status = 500;
            console.log(error);
            result.error = error;
        } else {
            console.log('abc2');
            console.log('value', value);
            let userRegistration = await UserRegistration.create(value, {
                include: []
            });
            result.data = userRegistration;
        }
        // try {

        // } catch (error) {
        //     console.log('abc3');
        //     status = 500;
        //     console.log(error);
        //     result.error = error;
        // }

        return res.status(status).send(result);
    },

    addCalendarWorkId: async(req, res) => {
        let result = {};
        let status = 201;

        let { error, value } = validateUserRegistration(req.body);

        if (error) {
            console.log('abc');
            status = 500;
            result.status = status;
            result.error = error;
            return res.status(status).send(result);
        }
        let dataSave = await UserRegistration.findOne({
            where: {
                accountId: req.body.accountId,
                calendarWorkId: req.body.calendarWorkId
            }
        });
        if (dataSave) {
            console.log('abc3');
            status = 500;
            console.log(error);
            result.error = error;
        } else {
            console.log('abc2');
            console.log('value', value);
            let userRegistration = await UserRegistration.create(value, {
                include: []
            });
            result.data = userRegistration;
        }
        // try {

        // } catch (error) {
        //     console.log('abc3');
        //     status = 500;
        //     console.log(error);
        //     result.error = error;
        // }

        return res.status(status).send(result);
    },

    show: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let userRegistration = await UserRegistration.findByPk(req.params.id);
            if (userRegistration == null) {
                status = 400;
            } else {
                result.data = userRegistration;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }

        return res.status(status).send(result);
    },


    update: async(req, res) => {
        let result = {};
        let status = 201;

        let { error, value } = validateUserRegistration(req.body);
        if (error) {
            status = 500;
            console.log(error);
            result.error = error;
            return res.status(status).send(result);
        }

        try {
            let userRegistration = await UserRegistration.findByPk(req.params.id);
            userRegistration.orderMetaId = value.orderMetaId;
            let affectedRows = await UserRegistration.save();
            result.data = affectedRows;
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
            let userRegistration = await UserRegistration.findAll({
                include: [ // Notice `include` takes an ARRAY
                    OrderMeta,
                    Account
                ],
                where: {
                    orderMetaId: req.query.orderMetaId
                }
            });
            result.data = userRegistration;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getAllCalendarWorkId: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let userRegistration = await UserRegistration.findAll({
                include: [ // Notice `include` takes an ARRAY
                    CalendarWork,
                    Account
                ],
                where: {
                    calendarWorkId: req.query.calendarWorkId
                }
            });
            result.data = userRegistration;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    import: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let userRegistration = await UserRegistration.bulkCreate(req.body);
            result.data = userRegistration;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    backup: async(req, res) => {
        let result = {};
        let status = 200;
        result.data = await data.UserRegistration;
        return res.status(status).send(result);
    }
};