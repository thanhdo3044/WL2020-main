const dmvt = require("./dmvt");

module.exports = router => {
    dmvt(router);
    return router;
};