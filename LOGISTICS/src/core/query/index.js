module.exports = {
   getGoodsIssueNumberMax : `SELECT MAX(NUMBER) NUMBER
                                FROM lgt.[GOODS_ISSUE]
                                WHERE [YEAR] = @YEAR
                                AND [MONTH] = @MONTH `
}