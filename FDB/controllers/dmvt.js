const { QueryTypes } = require("sequelize");
const db = {};
const { sequelize } = require("../config/config");
module.exports = {
    getMaVT: async(req, res) => {
        let result = {};
        let status = 200;
        console.log('getmaVT')
        let { ma_vt } = req.query;
        try {
            let requests = await sequelize.query(
                `
                select ma_vt,ten_vt,dvt,ma_vt2 from dbo.dmvt where ma_vt='${ma_vt}'`, { type: QueryTypes.SELECT }
            );
            result.data = requests;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },

};