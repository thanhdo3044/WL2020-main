﻿/*
DECLARE @E INT

EXEC Proc_createPallet
999998,
200,
100000,
100001,
100000,
@ERROR = @E OUTPUT
*/

--SELECT * FROM prod.PALLET

CREATE OR ALTER PROC Proc_createPallet -- mộc máy, lắp ráp, đóng gói
@FROM_ID INT,
@TO_ID INT,
@ITEM_ID INT,
@QUANTITY MONEY,
@MATERIALS_ID INT,
@MATERIALS_QUANTITY INT,
@PLAN_ID INT,
@TYPE_ID INT,
@IKEA_CODE VARCHAR(100),
@IKEA_GUID VARCHAR(100),
@VENDOR_ID INT, -- Phụ
@WOOD_TYPE_ID INT,
@PRODUCTION_ORDERS_ID INT,
@CHEMISTRY_ID INT, -- Phụ
@PARCEL NVARCHAR(500), -- Phụ
@PROJECT_PRODUCT_ID INT,
@ACCOUNT_ID INT,
@ERROR INT OUTPUT
AS
BEGIN
SET XACT_ABORT ON
BEGIN TRANSACTION
	-- Tạo biến mã ballet
	DECLARE @PALLET_NUMBER INT
	-- Lấy ra mã ballet lớn nhất của tuần đó
	SELECT @PALLET_NUMBER = MAX([NUMBER])
	FROM prod.[PALLET]
	WHERE [YEAR] = YEAR(GETDATE())
	AND [WEEK] = DATEPART(WK,GETDATE())
	-- Nếu tuần đó chưa có mã ballet nào thì cho mã là 1, ko thì + 1
	IF @PALLET_NUMBER IS NULL
		BEGIN
			SET @PALLET_NUMBER = 1
		END
	ELSE
		BEGIN
			SET @PALLET_NUMBER = @PALLET_NUMBER + 1
		END
	DECLARE @PALLET_NUMBER_STRING VARCHAR(10)
	IF (@PALLET_NUMBER < 10)
	BEGIN
		SET @PALLET_NUMBER_STRING = CONCAT('000',@PALLET_NUMBER)
	END
	ELSE
	BEGIN
		IF (@PALLET_NUMBER < 100)
		BEGIN
			SET @PALLET_NUMBER_STRING = CONCAT('00',@PALLET_NUMBER)
		END
		ELSE
		BEGIN
			IF (@PALLET_NUMBER < 1000)
			BEGIN
				SET @PALLET_NUMBER_STRING = CONCAT('0',@PALLET_NUMBER)
			END
			ELSE
			BEGIN
				SET @PALLET_NUMBER_STRING = @PALLET_NUMBER
			END
		END
	END


		DECLARE @YEAR VARCHAR(20) = RIGHT(YEAR(GETDATE()),2)
		DECLARE @WEEK VARCHAR(20)
		IF DATEPART(WK,GETDATE()) < 10
		BEGIN
			SET @WEEK = CONCAT('0',DATEPART(WK,GETDATE()))
		END
		ELSE
		BEGIN
			SET @WEEK = DATEPART(WK,GETDATE())
		END
	--Chèn mã ballet
	DECLARE @PALLET_ID INT
	DECLARE @PALLET_GUID UNIQUEIDENTIFIER = NEWID()
	INSERT INTO prod.[PALLET]([GUID],[CODE],[YEAR],[WEEK],[NUMBER],IKEA_CODE,IKEA_GUID,TYPE_ID,PROJECT_PRODUCT_ID,PARCEL,WOOD_TYPE_ID,PRODUCTION_ORDERS_ID,CREATE_BY,CREATE_DATE)
	VALUES (@PALLET_GUID,CONCAT(@YEAR,@WEEK,@PALLET_NUMBER_STRING),YEAR(GETDATE()),@WEEK,@PALLET_NUMBER,@IKEA_CODE,@IKEA_GUID,@TYPE_ID,@PROJECT_PRODUCT_ID,@PARCEL,@WOOD_TYPE_ID,@PRODUCTION_ORDERS_ID,@ACCOUNT_ID, GETDATE())
	
	SELECT @PALLET_ID = ID FROM prod.[PALLET] WHERE [GUID] = @PALLET_GUID
	-- chèn item in pallet
	INSERT INTO prod.[ITEM_IN_PALLET]
	VALUES (NEWID(),@PALLET_ID,@ITEM_ID,@QUANTITY)
	
	DECLARE @STEP_OF_PALLET_ID INT
	DECLARE @STEP_OF_PALLET_GUID UNIQUEIDENTIFIER = NEWID()
	DECLARE @PACKAGE_ID INT
	DECLARE @PACKAGE_GUID UNIQUEIDENTIFIER = NEWID()
	DECLARE @ITEM_IN_PACKAGE_ID INT
	DECLARE @ITEM_IN_PACKAGE_GUID UNIQUEIDENTIFIER = NEWID()

	INSERT INTO prod.[STEP_OF_PALLET]([GUID],PALLET_ID,STEP_ID,STEP_NEXT_ID,ITEM_ID,PASS,NOT_PASS,PLAN_ID,CREATE_BY,CREATE_DATE)
	VALUES(@STEP_OF_PALLET_GUID,@PALLET_ID,@FROM_ID,@TO_ID,@ITEM_ID,@QUANTITY,0,@PLAN_ID,@ACCOUNT_ID, GETDATE())
	SELECT @STEP_OF_PALLET_ID = ID FROM prod.[STEP_OF_PALLET] WHERE [GUID] = @STEP_OF_PALLET_GUID

	INSERT INTO prod.[PACKAGE]([GUID],[STEP_OF_PALLET_ID],SOURCE_ID,DESTINATION_ID,[TYPE_ID],CREATE_BY,CREATE_DATE)
	VALUES(@PACKAGE_GUID,@STEP_OF_PALLET_ID,@FROM_ID,@TO_ID,@TYPE_ID,@ACCOUNT_ID,GETDATE())
	SELECT @PACKAGE_ID = ID FROM prod.[PACKAGE] WHERE [GUID] = @PACKAGE_GUID

	-- nếu tạo nội bộ trong kho thì sẽ xác nhận luôn
	IF (@FROM_ID = @TO_ID)
	BEGIN
		UPDATE prod.[PACKAGE]
		SET VERIFY_BY = @ACCOUNT_ID,VERIFY_DATE = GETDATE()
		WHERE ID = @PACKAGE_ID
	END

	INSERT INTO prod.[ITEM_IN_PACKAGE]([GUID],PACKAGE_ID,ITEM_ID,QUANTITY)
	VALUES (@ITEM_IN_PACKAGE_GUID,@PACKAGE_ID,@ITEM_ID,@QUANTITY)
	SELECT @ITEM_IN_PACKAGE_ID = ID FROM prod.[ITEM_IN_PACKAGE] WHERE [GUID] = @ITEM_IN_PACKAGE_GUID
	
	--INSERT INTO prod.[DEPENDENT]([GUID],STEP_OF_PALLET_ID,VENDOR_ID,CHEMISTRY_ID,PARCEL_ID)
	--VALUES (NEWID(),@STEP_OF_PALLET_ID,@VENDOR_ID,@CHEMISTRY_ID,@PARCEL_ID)

	-- Mức độ ưu tiên
	-- Kiểm tra xem có nguyên vật liệu gốc không
	-- Kiểm tra Bom
	-- Lấy chính sản phẩm xuất
	/*
	IF EXISTS (
				SELECT ID
				FROM prod.[BOM]
				WHERE ITEM_ID = @ITEM_ID)
				BEGIN -- nếu mà có bom cho sản phẩm xuất thì lấy theo bom
					INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],[ITEM_IN_PACKAGE_ID],[ITEM_ID],QUANTITY)
					SELECT NEWID(),@ITEM_IN_PACKAGE_ID,MATERIALS_ID,RATE*@QUANTITY
					FROM prod.BOM
					WHERE ITEM_ID = @ITEM_ID
				END
	ELSE
		BEGIN
			IF @MATERIALS_ID > 0
				BEGIN
					INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],[ITEM_IN_PACKAGE_ID],[ITEM_ID],QUANTITY)
					VALUES (NEWID(),@ITEM_IN_PACKAGE_ID,@MATERIALS_ID,@MATERIALS_QUANTITY)
				END
			ELSE
				BEGIN
					INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],[ITEM_IN_PACKAGE_ID],[ITEM_ID],QUANTITY)
					VALUES (NEWID(),@ITEM_IN_PACKAGE_ID,@ITEM_ID,@QUANTITY)
				END

		END
		*/
			IF @MATERIALS_ID > 0
				BEGIN
					INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],[ITEM_IN_PACKAGE_ID],[ITEM_ID],QUANTITY)
					VALUES (NEWID(),@ITEM_IN_PACKAGE_ID,@MATERIALS_ID,@MATERIALS_QUANTITY)
				END
			ELSE
				BEGIN
					IF EXISTS (
								SELECT ID
								FROM prod.[BOM]
								WHERE ITEM_ID = @ITEM_ID
							)
						BEGIN -- nếu mà có bom cho sản phẩm xuất thì lấy theo bom
							INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],[ITEM_IN_PACKAGE_ID],[ITEM_ID],QUANTITY)
							SELECT NEWID(),@ITEM_IN_PACKAGE_ID,MATERIALS_ID,RATE*@QUANTITY
							FROM prod.BOM
							WHERE ITEM_ID = @ITEM_ID
						END
					ELSE
						BEGIN
							INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],[ITEM_IN_PACKAGE_ID],[ITEM_ID],QUANTITY)
							VALUES (NEWID(),@ITEM_IN_PACKAGE_ID,@ITEM_ID,@QUANTITY)
						END
				END

	SELECT P.ID,
	P.CODE,
	@STEP_OF_PALLET_ID STEP_OF_PALLET_ID,
	P.CREATE_BY,
	P.CREATE_DATE
	FROM prod.[PALLET] P
	WHERE P.ID = @PALLET_ID

COMMIT
END