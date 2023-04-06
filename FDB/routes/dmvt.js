const controller = require("../controllers/dmvt.js");

module.exports = router => {
    router
        .route("/dmvt/getMaVT")
        .get(controller.getMaVT);
};