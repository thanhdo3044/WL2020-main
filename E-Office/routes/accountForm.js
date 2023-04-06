const controller = require("../controllers/accountForm");

module.exports = router => {
    router
        .route("/accountForm")
        .post(controller.add)
        .get(controller.getAll);

    router
        .route("/accountForm/:id")
        .get(controller.show)
        .delete(controller.delete)
        .put(controller.update);

    router.route("/accountForm/import").post(controller.import);
};