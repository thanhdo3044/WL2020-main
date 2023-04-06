const controller = require("../controllers/requests");

module.exports = router => {
  router
    .route("/requests")
    .post(controller.add)
    .get(controller.getAll)
    .put(controller.delete)
    .delete(controller.deleteReqAuthority);

  router
    .route("/requests-active")
    .get(controller.getAllRequestsToday)
    .put(controller.statusRequests)
    .post(controller.completedToRequestVT);

  router
    .route("/requests-active/:id")
    .put(controller.confirmSuccessOrder)
    .delete(controller.deleteById);

  router
    .route("/requests-active/:id")
    .put(controller.confirmSuccessOrder)
    .delete(controller.deleteById);

  router
    .route("/requests-isAuthority")
    .post(controller.isAuthority)
    .put(controller.checkPermissionAuthorised);

  router
    .route("/permissionAuthorised/:id")
    .post(controller.permissionAuthorised)
    .get(controller.getPermissionAuthorised)
    .delete(controller.delPermissionAuthorised)
    .put(controller.editPermissionAuthorised);

  router.route("/requests/import").post(controller.import);
  router.route("/requests/department").get(controller.getDepartmentMuaHang);

  router
    .route("/requests/:id")
    .post(controller.searchRequestSuccess)
    .get(controller.show)
    .delete(controller.delete)
    .put(controller.update);
};
