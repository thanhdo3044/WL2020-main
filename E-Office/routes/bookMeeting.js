const controller = require("../controllers/bookMeeting");

module.exports = router => {
    router
        .route("/bookMeeting")
        .post(controller.add)
        .get(controller.getAll);
    
    router
        .route("/bookMeeting/:id")
        .put(controller.update)
        .get(controller.getById)
        .delete(controller.delete);
    router
        .route("/meeting/getByStartTime")
        .get(controller.getByStartTime);
    router
        .route("/meeting/getByEndTime")
        .get(controller.getByEndTime);
    router
        .route("/meeting/getByDate")
        .get(controller.getByDate);
    router
        .route("/meeting/getDateBooking")
        .get(controller.getDateBooking);
    router
        .route("/meeting/get-booking-in-day")
        .get(controller.getBookingInDay);
    router
        .route("/meeting/getAllDateBooking")
        .get(controller.getAllDateBooking);
    router
        .route("/meeting/getAllBookingInDay")
        .get(controller.getAllBookingInDay);
};