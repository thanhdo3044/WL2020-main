const controller = require("../controllers/account");

module.exports = (router) => {
  router
    .route("/account-profile")
    .put(controller.update)
    .get(controller.get)
    .post(controller.import);

  router.route("/account-profile/all")
  .get(controller.getAll);

  router.route("/account-profile/update")
  .put(controller.updateAccount);
};
