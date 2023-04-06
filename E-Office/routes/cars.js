const controller = require("../controllers/cars");

module.exports = router => {
    router
        .route("/cars")
        .post(controller.add)
        .get(controller.getAll);

    router
        .route("/cars/:id")
        .get(controller.show)
        .delete(controller.delete)
        .put(controller.update);

    router.route("/cars/import").post(controller.import);
};