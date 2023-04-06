const controller = require("../controllers/order-files");
const upload = require("../uploadFiles");

module.exports = router => {
  router
    .route("/order-files")
    .post(controller.add)
    .get(controller.getAll);

  router
    .route("/order-files/:id")
    .get(controller.show)
    .delete(controller.delete)
    .put(controller.update);

  router.route("/order-files/import").post(controller.import);
};
