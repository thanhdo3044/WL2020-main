const { Cars, data, OrderMeta, Account } = require("../models");
const Joi = require("@hapi/joi");
const mssql = require('mssql')

function validateCars(value) {
    const schema = Joi.object({
        id: Joi.string(),
        CODE: Joi.string().required(),
        NAME: Joi.string().required()
    });
    return schema.validate(value);
}

module.exports = {
    delete: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let cars = await Cars.findByPk(req.params.id);
            if (cars === null) {
                status = 400;
            } else {
                let affectedRows = await Cars.destroy();
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

        let { error, value } = validateCars(req.body);

        if (error) {
            console.log('abc');
            status = 500;
            result.status = status;
            result.error = error;
            return res.status(status).send(result);
        }

        try {
            console.log('abc2');
            console.log('value', value);
            let cars = await Cars.create(value, {
                include: []
            });
            result.data = cars;
        } catch (error) {
            console.log('abc3');
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },

    show: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let cars = await Cars.findByPk(req.params.id);
            if (cars == null) {
                status = 400;
            } else {
                result.data = cars;
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

        let { error, value } = validateCars(req.body);
        if (error) {
            status = 500;
            console.log(error);
            result.error = error;
            return res.status(status).send(result);
        }

        try {
            let cars = await Cars.findByPk(req.params.id);
            cars.NAME = value.NAME;
            let affectedRows = await Cars.save();
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
            let cars = await Cars.findAll({
                include: [ // Notice `include` takes an ARRAY
                    // OrderMeta,
                    // Account
                ],
                // where: {
                //     orderMetaId: req.query.orderMetaId
                // }
            });
            result.data = cars;
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
            let cars = await Cars.bulkCreate(req.body);
            result.data = cars;
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
        result.data = await data.Cars;
        return res.status(status).send(result);
    }
};