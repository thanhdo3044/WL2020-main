const controller = require("../controllers/calendarWork");

module.exports = router => {
    router
        .route("/calendarWork")
        .post(controller.add)
        .get(controller.getAll);

    router
        .route("/calendarWork/:id")
        .get(controller.show)
        .delete(controller.delete)
        .put(controller.update);
    router
        .route("/calendarWorkSearch")
        .get(controller.getAllSearch)
        .post(controller.getAllActive)
        .delete(controller.delete)
        .put(controller.update);

    router
        .route("/accountForm")
        .get(controller.getAllAccountForm)

    router
        .route("/getCarById")
        .get(controller.getCarById)

    router
        .route("/account")
        .get(controller.getAccountByID)
    router.route("/calendarWork/import").post(controller.import);
};