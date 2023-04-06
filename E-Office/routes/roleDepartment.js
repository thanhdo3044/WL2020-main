const controller = require("../controllers/roleDepartment");

module.exports = (router) => {
  router.route("/role-department/role").get(controller.getBophanLamViec);
  router
    .route("/role-department")
    .post(controller.insertRoleDepartment)
    .put(controller.updateRoleDepartment);
  router.route("/role-department/:id").delete(controller.deleteRoleDepartment);
  router
    .route("/role-department/account-by-department")
    .get(controller.getAccountByDepartmentId);
  router.route("/role-department/position").get(controller.getPosition);
  router.route("/role-department/user").get(controller.getUser);
  router.route("/role-department/desk-manager").put(controller.updateDeskManager);
  router.route("/role-department/delete-by-department").post(controller.deleteByDepartment);
};
