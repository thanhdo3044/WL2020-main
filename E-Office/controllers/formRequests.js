const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");

module.exports = {
    getAllForm: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `select * from base.ProposalForm where parentId is not null`, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    }
};