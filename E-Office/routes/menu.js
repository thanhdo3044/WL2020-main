const controller = require("../controllers/menu");

module.exports = router => {
    router
        .route("/menu-Eoffice")
        .post(controller.getMenuDesk)
        .get(controller.get);

    router
        .route("/menu-Eoffice/menu-mobile")
        .get(controller.getMenuMobile)
        .post(controller.addMenuMobile)
        .put(controller.updateMenuMobile);
    router
        .route("/menu-Eoffice/thong-tin")
        .get(controller.getMenuMobileThongTin)
};