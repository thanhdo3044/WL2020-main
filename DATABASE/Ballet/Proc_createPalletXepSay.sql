﻿CREATE OR ALTER PROC Proc_createPalletXepSay
@SOURCE_ID INT,
@DESTINATION_ID INT,
@ITEM VARCHAR(MAX), --'100000-10,100000-20'
@PLAN_ID INT,
@PARCEL NVARCHAR(500),
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
		INSERT INTO prod.[PALLET]([GUID],[CODE],[YEAR],[WEEK],[NUMBER],[PARCEL],CREATE_BY,CREATE_DATE)
		VALUES (@PALLET_GUID,CONCAT(@YEAR,@WEEK,@PALLET_NUMBER_STRING),YEAR(GETDATE()),@WEEK,@PALLET_NUMBER,@PARCEL,@ACCOUNT_ID, GETDATE())
		SELECT @PALLET_ID = ID FROM prod.[PALLET] WHERE [GUID] = @PALLET_GUID
		
		-- chèn item trong pallet
        INSERT INTO prod.[ITEM_IN_PALLET]([GUID],PALLET_ID,ITEM_ID,QUANTITY)
		SELECT NEWID(),@PALLET_ID,SUBSTRING([VALUE],1,6),SUBSTRING([VALUE],8,LEN([VALUE]))
		FROM STRING_SPLIT(@ITEM,',')

		DECLARE @STEP_OF_PALLET_ID INT
		DECLARE @STEP_OF_PALLET_GUID UNIQUEIDENTIFIER = NEWID()
		DECLARE @PACKAGE_ID INT
		DECLARE @PACKAGE_GUID UNIQUEIDENTIFIER = NEWID()
		
		INSERT INTO prod.[STEP_OF_PALLET]([GUID],[PALLET_ID],[STEP_ID],[STEP_NEXT_ID],PLAN_ID,CREATE_BY,CREATE_DATE)
		VALUES(@STEP_OF_PALLET_GUID,@PALLET_ID,@SOURCE_ID,@DESTINATION_ID,@PLAN_ID,@ACCOUNT_ID,GETDATE())
		SELECT @STEP_OF_PALLET_ID = ID FROM prod.[STEP_OF_PALLET] WHERE [GUID] = @STEP_OF_PALLET_GUID

		INSERT INTO prod.[PACKAGE]([GUID],STEP_OF_PALLET_ID,SOURCE_ID,DESTINATION_ID,CREATE_BY,CREATE_DATE)
		VALUES(@PACKAGE_GUID,@STEP_OF_PALLET_ID,@SOURCE_ID,@DESTINATION_ID,@ACCOUNT_ID,GETDATE())
		SELECT @PACKAGE_ID = ID FROM prod.[PACKAGE] WHERE [GUID] = @PACKAGE_GUID

		INSERT INTO prod.[ITEM_IN_PACKAGE]([GUID],PACKAGE_ID,ITEM_ID,QUANTITY)
		SELECT NEWID(),@PACKAGE_ID,SUBSTRING([VALUE],1,6),SUBSTRING([VALUE],8,LEN([VALUE]))
		FROM STRING_SPLIT(@ITEM,',')

		INSERT INTO prod.[MATERIALS_IN_PACKAGE]([GUID],ITEM_IN_PACKAGE_ID,ITEM_ID,QUANTITY)
		SELECT NEWID(),IIP.ID,IIP.ITEM_ID,IIP.QUANTITY
		FROM prod.[ITEM_IN_PACKAGE] IIP
		LEFT JOIN prod.[MATERIALS_IN_PACKAGE] MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
		WHERE MIP.ID IS NULL


        SELECT P.ID,
		P.CODE,
		P.CREATE_BY,
		P.CREATE_DATE
		FROM prod.[PALLET] P
		WHERE P.ID = @PALLET_ID 

    COMMIT
END