const controller = require("../controllers/document");

module.exports = router => {
  router.route("/document").post(controller.import).get(controller.get);
};
