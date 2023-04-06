const controller = require("../controllers/payslip");

module.exports = router => {
    router.route("/payslip/import").post(controller.import);
    router.route("/payslip/import/payslip-t13").post(controller.importPayslipT13);
    router.route("/payslip/import/condition-t13").get(controller.getByConditionT13);
    router.route("/getByCondition/:month/:year/:khoi").get(controller.getByCondition);
    router.route("/payslipByAccount/:accountId/:year").get(controller.getAll).post(controller.getByAccount);
    router.route("/payslipById/:id").get(controller.getById);
};