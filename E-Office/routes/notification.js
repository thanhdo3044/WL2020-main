const controller = require("../controllers/notification");

module.exports = router => {
  router
    .route("/notification")
    .post(controller.insert)
    .get(controller.get)
    .put(controller.put);

  router.route("/notificationDetail").get(controller.getNotificationDetail);

  router.route("/send-mail").post(controller.sendMail);

  router.route("/send-mail-OTP").post(controller.sendOTPMail);

  router.route("/check-Mail-OTP").post(controller.checkMailOTP);

  // router.route("/send-mail-errorTime").post(controller.sendErrorTimeMail);
  // router.route("/send-mail-payslip").post(controller.sendPaySlipMail);
  
  router
    .route("/active-notificationMail")
    .put(controller.activeNotificationMail);

  router
    .route("/unActive-notificationMail")
    .put(controller.unActiveNotificationMail);

  // router
  //     .route("/send-Viber")
  //     .post(controller.sendViber)
};
