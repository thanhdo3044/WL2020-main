CREATE OR ALTER PROC Proc_verifyPackage
@PACKAGE_ID INT,
@TYPE_ID INT,
@ACCOUNT_ID INT,
@ERROR INT OUTPUT
AS
BEGIN
	SET XACT_ABORT ON
BEGIN TRANSACTION
	IF NOT EXISTS (
		SELECT ID
		FROM prod.[PACKAGE]
		WHERE ID = @PACKAGE_ID
	)
	BEGIN
		ROLLBACK
		SET @ERROR = 430
		RETURN
	END
	
	UPDATE prod.[PACKAGE]
	SET [TYPE_ID] = @TYPE_ID, VERIFY_BY = @ACCOUNT_ID,VERIFY_DATE = GETDATE()
	WHERE ID = @PACKAGE_ID

COMMIT
	SELECT ID FROM prod.[PACKAGE]
	WHERE ID = @PACKAGE_ID
END