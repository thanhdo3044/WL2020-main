CREATE OR ALTER PROC wood.Proc_Insert_Calculator
@ITEM_ID INT,@RECEIPT_ID INT,@NOTE NVARCHAR(300),@IS_DOUBLE INT,@INPUT_TYPE_ID INT,@UID INT,@ITEM_TYPE AS NCHAR(10),@INSPECT_RATE FLOAT,
@PAY_RATE FLOAT,@QC_VOLUMN FLOAT,@WH_VOLUMN FLOAT,@GOOD_QTY INT
AS
BEGIN
	DECLARE 
		@VENDOR_REGION_ID AS INT, -- VÙNG CỦA NHÀ CUNG CẤP,
		@NEW_PRICE AS INT = 0,
		@MODULE_ID AS INT, -- MODULE : VÁN HAY NGUYÊN LIỆU GỖ
		@RECEIPT_DATE AS DATETIME,
		@MODULE_VAN AS INT = 100006,
		@PRICE_OF_TYPE AS INT,
		@RESULT AS BIT,
		@MESSAGE AS NVARCHAR(400)

	-- MODULE FIXED
	-- 100006 -> VÁN
	-- 100000 -> NGUYÊN LIỆU GỖ
	-- LẤY THÔNG TIN VỀ VÙNG CỦA NHÀ CUNG CẤP, NGÀY NHẬP KHO
	SELECT @VENDOR_REGION_ID = REGION_ID FROM base.VENDOR WHERE ID = (SELECT VENDOR_ID FROM WH_RECEIPT WHERE ID=@RECEIPT_ID)
	SELECT @RECEIPT_DATE = RECEIPT_DATE,@MODULE_ID=MODULE_ID FROM  wood.WH_RECEIPT WHERE ID = @RECEIPT_ID

	
	-- LẤY GIÁ SẢN PHẨM, THEO NGÀY ÁP DỤNG VÀ NGÀY NHẬP KHO
	SELECT @NEW_PRICE = PRICE FROM wood.WOOD_PRICE_LIST WHERE APPLY_STATUS=1 AND APPLY_DATE >= @RECEIPT_DATE AND ITEM_ID=@ITEM_ID AND [TYPE]=@ITEM_TYPE AND [REGION_ID]=@VENDOR_REGION_ID
	ORDER BY APPLY_DATE DESC

	IF @MODULE_ID =@MODULE_VAN
		BEGIN
			SET @PRICE_OF_TYPE =@NEW_PRICE
		END
	ELSE
		BEGIN
			SET @PRICE_OF_TYPE = 0
		END
	BEGIN TRY
		INSERT INTO wood.WOOD_PAY_CALCULATOR([INPUT_TYPE_ID],[RECEIPT_ID],[ITEM_ID],[NOTE],[IS_DOUBLE],[COMPANY_PRICE],[ITYPE_PRICE],[CREATE_AT],[CREATE_BY],[INSPECT_RATE],[PAY_RATE],[GOOD_QTY],[QC_VOLUMN],[WH_VOLUMN])
		VALUES(@INPUT_TYPE_ID,@RECEIPT_ID,@ITEM_ID,@NOTE,@IS_DOUBLE,@NEW_PRICE,@PRICE_OF_TYPE,GETDATE(),@UID,@INSPECT_RATE,@PAY_RATE,@GOOD_QTY,@QC_VOLUMN,@WH_VOLUMN)
		SELECT @RESULT=1,@MESSAGE=N'Thành Công !'
	END TRY
	BEGIN CATCH
		SELECT @RESULT = 0, @MESSAGE = ERROR_MESSAGE()
	END CATCH
	SELECT @RESULT AS [RESULT],@MESSAGE AS [MESSAGE]
END

SELECT * FROM wood.WH_RECEIPT_DTL

SELECT * FROM wood.WOOD_PAY_CALCULATOR