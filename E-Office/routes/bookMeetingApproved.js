const controller = require("../controllers/bookMeetingApproved");

module.exports = router => {
    router
        .route("/bookMeetingApproved")
        .post(controller.add)
        .get(controller.getAll);
    
    router
        .route("/bookMeetingApproved/:id")
        .put(controller.update)
        .get(controller.getById)
        .delete(controller.delete);
};