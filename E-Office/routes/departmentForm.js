const controller = require("../controllers/departmentForm");

module.exports = router => {
    router
        .route("/departmentForm")
        .post(controller.add)
        .get(controller.getAll);

    router
        .route("/departmentForm/:id")
        .get(controller.show)
        .delete(controller.delete)
        .put(controller.update);

    router
        .route("/departmentAll")
        .get(controller.show)

    router.route("/departmentForm/import").post(controller.import);
};