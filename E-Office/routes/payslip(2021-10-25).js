const controller = require("../controllers/payslip");

module.exports = router => {
    router.route("/payslip/import").post(controller.import);
    router.route("/getByCondition/:month/:year/:khoi").get(controller.getByCondition);
    router.route("/payslipByAccount/:accountId/:year").get(controller.getAll);
    router.route("/payslipById/:id").get(controller.getById);
};