create or ALTER       PROC [wood].[Proc_Create_Detail_WH_Receipt]
	@RECEIPT_ID INT,@ITEM_ID INT,@PCS_PACKAGE INT,@PACKAGE_QUANTITY INT,
	@INPUT_TYPE_ID INT,@NOTE NVARCHAR(300),@LEAVE  BIT,@OVERPLAN BIT,@UID INT,@DTYPE AS NCHAR(10),@WTYPE AS INT
AS
BEGIN
	DECLARE @RESULT BIT 
	BEGIN TRY
		INSERT INTO wood.WH_RECEIPT_DTL([WH_RECEIPT_ID],[ITEM_ID],[PCS_PER_PACKAGE],[PACKAGE_QUANTITY],[INPUT_TYPE_ID],
		[NOTE],[LEAVE],[OVER_PLAN],[DEL_FLAG],CREATE_AT,CREATE_BY,DTYPE,WTYPE)
		VALUES(@RECEIPT_ID,@ITEM_ID,@PCS_PACKAGE,@PACKAGE_QUANTITY,@INPUT_TYPE_ID,@NOTE,@LEAVE,@OVERPLAN,'N',GETDATE(),@UID,@DTYPE,@WTYPE)
		SET @RESULT=1
		SELECT @RESULT AS [RESULT],N'Thành công !' AS [MESSAGE],@LEAVE AS LEAVE
	END TRY
	BEGIN CATCH
		SET @RESULT=0
		SELECT 0 AS [RESULT],ERROR_MESSAGE() AS [MESSAGE] 
	END CATCH
END