const express = require('express')
const Router = express.Router()
const departmentController = require('../controller/department')
Router.get('/', departmentController.getFactoryVCN)
module.exports = Router