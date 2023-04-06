const controller = require("../controllers/formRequests");

module.exports = router => {
    router
        .route("/formRequests")
        .get(controller.getAllForm)
};