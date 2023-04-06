const controller = require("../controllers/notification");

module.exports = router => {
    router
        .route("/notification")
        .post(controller.insert)
        .get(controller.get)
        .put(controller.put);

    router
        .route("/send-mail")
        .post(controller.sendMail)

    router
        .route("/active-notificationMail")
        .put(controller.activeNotificationMail)

    router
        .route("/unActive-notificationMail")
        .put(controller.unActiveNotificationMail)

    // router
    //     .route("/send-Viber")
    //     .post(controller.sendViber)

};