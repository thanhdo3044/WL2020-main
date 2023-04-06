const controller = require("../controllers/orders");

module.exports = router => {
    router
        .route("/orders")
        .post(controller.add)
        .get(controller.getAll)
        .put(controller.resetOrder);

    router
        .route("/orders/confirmPriorityLevel")
        .put(controller.confirmPriorityLevel);

    // router
    //     .route("/orders/getMaVT")
    //     .get(controller.getMaVT);

    router
        .route("/orders/getAllOrders")
        .get(controller.getAllOrders)
        .post(controller.searchOrderRangeTime);

    router
        .route("/orders/getXNVOrders")
        .get(controller.getXNVOrders);
    router
        .route("/orders/getLTGOrders")
        .get(controller.getLTGOrders);
    router
        .route("/orders/getXRCOrders")
        .get(controller.getXRCOrders);

    router
        .route("/orders/:id")
        .get(controller.show)
        .delete(controller.delete)
        .put(controller.resetOrder)
        .post(controller.updateOrder);

    router
        .route("/orders/:id/activeSeen")
        .post(controller.updateSeenOrder);

    router
        .route("/orders/:id/activeSuccess")
        .post(controller.updateSuccessOrder);

    router.route("/orders/import").post(controller.import);

    router.route("/orders/order/status").get(controller.getOrderByStatus);

    router.route("/orders/order/status/date").get(controller.getOrderByStatusAndDate);
};