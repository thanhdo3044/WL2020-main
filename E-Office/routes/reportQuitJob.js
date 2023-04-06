const controller = require("../controllers/reportQuitJob");

module.exports = router => {
  router
    .route("/reportDashboard")
    .get(controller.delete)
    .post(controller.get);
};
