const controller = require("../controllers/forgetPassword");

module.exports = router => {
  router.route("/forgetPassword").post(controller.checkProfileAccount);
};
