const controller = require("../controllers/orderMetas");

module.exports = router => {
    router
        .route("/order-metas")
        .post(controller.add)
        .get(controller.getAll)
        .put(controller.deleteDetail);

    router
        .route("/order-metas/:id")
        .get(controller.show)
        .delete(controller.delete)
        .put(controller.update);
    router
        .route("/order-metas/OT/:id")
        .put(controller.updateOT);

    router
        .route("/order-metas-search")
        .get(controller.searchForm)



    router.route("/order-metas/import").post(controller.import);
};