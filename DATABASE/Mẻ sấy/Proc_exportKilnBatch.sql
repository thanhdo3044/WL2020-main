﻿/*
DECLARE @E INT
EXEC Proc_exportKilnBatch
100003,
100000,
@ERROR = @E OUTPUT
PRINT @E
*/


CREATE OR ALTER PROC Proc_exportKilnBatch
@KILN_BATCH_ID INT,
@ACCOUNT_ID INT,
@ERROR INT OUTPUT
AS
BEGIN
	IF NOT EXISTS ( -- kiểm tra xem mẻ đó có ko và đã ra lò chưa và qc đã xác nhận
		SELECT ID
		FROM prod.[KILN_BATCH]
		WHERE ID = @KILN_BATCH_ID
	AND TIME_OUT_REAL IS NULL
	AND VERIFY IS NOT NULL
	)
	BEGIN
		SET @ERROR = 4700
		RETURN
	END

SET XACT_ABORT ON
BEGIN TRANSACTION 
	
	INSERT INTO prod.STEP_OF_PALLET ([GUID],PALLET_ID,STEP_ID,STEP_NEXT_ID,ITEM_ID,CREATE_BY,CREATE_DATE)
	SELECT NEWID(),SOP.PALLET_ID,K.STEP_ID,KB.STEP_NEXT_ID,ITEM_ID,@ACCOUNT_ID,GETDATE()
	FROM prod.[STEP_OF_PALLET] SOP
	LEFT JOIN prod.KILN_BATCH KB ON KB.ID = SOP.KILN_BATCH_ID
	LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
	WHERE SOP.KILN_BATCH_ID = @KILN_BATCH_ID

	INSERT INTO prod.PACKAGE (GUID,STEP_OF_PALLET_ID,SOURCE_ID,DESTINATION_ID,CREATE_BY,CREATE_DATE,VERIFY_BY,VERIFY_DATE)
	SELECT NEWID(),SOPOUT.ID,SOPOUT.STEP_ID,SOPOUT.STEP_NEXT_ID,@ACCOUNT_ID,GETDATE(),@ACCOUNT_ID,GETDATE()
	FROM prod.STEP_OF_PALLET SOP
	LEFT JOIN prod.STEP_OF_PALLET SOPOUT ON SOPOUT.PALLET_ID = SOP.PALLET_ID AND SOPOUT.STEP_ID = SOP.STEP_NEXT_ID
	WHERE SOP.KILN_BATCH_ID = @KILN_BATCH_ID
	GROUP BY SOPOUT.ID,SOPOUT.STEP_ID,SOPOUT.STEP_NEXT_ID

	INSERT INTO prod.ITEM_IN_PACKAGE([GUID],PACKAGE_ID,ITEM_ID,QUANTITY)
	SELECT NEWID(),P.ID,IIP.ITEM_ID,IIP.QUANTITY
	FROM prod.STEP_OF_PALLET SOP
	LEFT JOIN prod.STEP_OF_PALLET SOPOUT ON SOPOUT.PALLET_ID = SOP.PALLET_ID AND SOPOUT.STEP_ID = SOP.STEP_NEXT_ID
	LEFT JOIN prod.PACKAGE P ON P.STEP_OF_PALLET_ID = SOPOUT.ID
	LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = SOPOUT.PALLET_ID
	WHERE SOP.KILN_BATCH_ID = @KILN_BATCH_ID
	GROUP BY SOPOUT.ID,P.ID,IIP.ITEM_ID,IIP.QUANTITY

	INSERT INTO prod.MATERIALS_IN_PACKAGE([GUID],ITEM_IN_PACKAGE_ID,ITEM_ID,QUANTITY)
	SELECT NEWID(),IIP.ID,IIP.ITEM_ID,IIP.QUANTITY
	FROM prod.STEP_OF_PALLET SOP
	LEFT JOIN prod.STEP_OF_PALLET SOPOUT ON SOPOUT.PALLET_ID = SOP.PALLET_ID AND SOPOUT.STEP_ID = SOP.STEP_NEXT_ID
	LEFT JOIN prod.PACKAGE P ON P.STEP_OF_PALLET_ID = SOPOUT.ID
	LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
	WHERE SOP.KILN_BATCH_ID = @KILN_BATCH_ID
	GROUP BY SOPOUT.ID,IIP.ID,IIP.ITEM_ID,IIP.QUANTITY

	UPDATE prod.[KILN_BATCH]
	SET TIME_OUT_REAL = DATEDIFF(DAY, [CREATE_DATE], GETDATE()),
	EXPORT_BY = @ACCOUNT_ID,
	EXPORT_DATE = GETDATE(),
	[STATUS] = 'finish'
	WHERE ID = @KILN_BATCH_ID
COMMIT
	-- Trả về id mẻ sấy
	SELECT ID
	FROM prod.[KILN_BATCH]
	WHERE ID = @KILN_BATCH_ID
	-- Trả về thông tin package
	SELECT
	P.ID packageId,
	P.SOURCE_ID fromId,
	P.DESTINATION_ID toId,
	P.CREATE_BY createBy,
	P.CREATE_DATE createDate
	FROM prod.STEP_OF_PALLET SOP
	LEFT JOIN prod.STEP_OF_PALLET SOPOUT ON SOPOUT.PALLET_ID = SOP.PALLET_ID AND SOPOUT.STEP_ID = SOP.STEP_NEXT_ID
	LEFT JOIN prod.PACKAGE P ON P.STEP_OF_PALLET_ID = SOPOUT.ID
	WHERE SOP.KILN_BATCH_ID = @KILN_BATCH_ID
	-- Trả về thông tin item trong package
	SELECT 
	P.ID packageId,
	IIP.ID itemInPackageId,
	IIP.ITEM_ID itemId,
	IIP.QUANTITY quantity
	FROM prod.STEP_OF_PALLET SOP
	LEFT JOIN prod.STEP_OF_PALLET SOPOUT ON SOPOUT.PALLET_ID = SOP.PALLET_ID AND SOPOUT.STEP_ID = SOP.STEP_NEXT_ID
	LEFT JOIN prod.PACKAGE P ON P.STEP_OF_PALLET_ID = SOPOUT.ID
	LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
	WHERE SOP.KILN_BATCH_ID = @KILN_BATCH_ID

	-- Không cần trả về nguyên liệu vì sẽ bằng chính thành phẩm
END