const controller = require("../controllers/meetingRoom");

module.exports = router => {
    router
        .route("/meetingRoom")
        .post(controller.add)
        .get(controller.getAll);
    
    router
        .route("/meetingRoom/:id")
        .put(controller.update)
        .get(controller.getById)
        .delete(controller.delete);
    router
        .route("/meeting/get-by-location")
        .get(controller.getByLocation);
};