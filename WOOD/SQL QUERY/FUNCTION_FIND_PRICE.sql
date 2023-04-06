CREATE FUNCTION FUNC_GET_PRICE_WOOD(
	@RECEIPT_DATE DATETIME,@ITEM_ID INT,@DTYPE AS NCHAR(10),@VENDOR_REGION_ID INT
)
RETURNS INT
AS
BEGIN
	DECLARE @RESULT AS INT
	SELECT @RESULT =  PRICE FROM  wood.WOOD_PRICE_LIST WHERE ITEM_ID=@ITEM_ID AND APPLY_DATE>=@RECEIPT_DATE AND [TYPE]=@DTYPE AND
	REGION_ID=@VENDOR_REGION_ID AND APPLY_STATUS=1  ORDER BY APPLY_DATE DESC
	RETURN @RESULT
END