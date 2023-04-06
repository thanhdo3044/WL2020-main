const {
    Department
} = require("../models")
const {
    Op
} = require("sequelize")
module.exports = {
    getFactoryVCN: async (req, res) => {
        try {
            const data = await Department.findAll({
                where: {
                    [Op.and]: [{
                        parentId: 102395
                    }, {
                        type2: 'factory'
                    }]
                }
            })
            return res.status(200).json({
                data,
                message: 'OK',
                success: true
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                error,
                message: 'server error'
            })
        }


    }
}