const { po } = require('../models');
const sequelize = require('../config/config')
module.exports = {
    createPO: async (req, res) => {
        try {
            const data = await PoVCN.bulkCreate(req.body)
            if (!data)
                return res.status(400).json({
                    message: 'Có lỗi xảy ra',
                    success: false,
                })
            return res.status(200).json({
                message: 'Tạo kế hoạch thành công',
                success: true,
                data
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'serve error', error })
        }

    }
}