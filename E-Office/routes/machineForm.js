const controller = require("../controllers/machineForm");

module.exports = router => {
    router
        .route("/machineAll")
        .get(controller.show);

    router
        .route("/machineForm/item")
        .get(controller.showItem);

    router
    .route("/machineForm/report")
    .put(controller.report);

    router
    .route("/machineForm/endTime")
    .get(controller.endTime);

    router
    .route("/machineForm/updateQuantityReport")
    .put(controller.updateQuantityReport);

    router
    .route("/machineForm/working")
    .get(controller.working);

    router
    .route("/machineForm/showReportByAccountId")
    .get(controller.showReportByAccountId);
};