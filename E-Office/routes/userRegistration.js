const controller = require("../controllers/userRegistration");

module.exports = router => {
    router
        .route("/userRegistration")
        .post(controller.add)
        .get(controller.getAll)
        .delete(controller.delete);

    router
        .route("/userRegistration/:id")
        .get(controller.show)
        .delete(controller.delete)
        .put(controller.update);

    router
        .route("/userRegistrationCalendarWork")
        .get(controller.getAllCalendarWorkId)
        .post(controller.addCalendarWorkId)
        .delete(controller.deleteCalendarWorkId)
        .put(controller.update);

    router.route("/userRegistration/import").post(controller.import);
};