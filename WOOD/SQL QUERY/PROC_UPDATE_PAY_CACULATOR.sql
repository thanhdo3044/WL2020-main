CREATE OR ALTER  PROC Proc_Update_Wood_Calculator
@ID INT,@AVE_PRICE INT
AS
BEGIN
	DECLARE @RESULT AS BIT,@MESSAGE AS NVARCHAR(300)
	BEGIN TRY
		UPDATE wood.WOOD_PAY_CALCULATOR SET AVERAGE_PRICE=@AVE_PRICE WHERE ID = @ID
		SELECT @RESULT=1,@MESSAGE =N'Th�nh c�ng !'
	END TRY
	BEGIN CATCH
		SELECT @RESULT=0,@MESSAGE=ERROR_MESSAGE()
	END CATCH 
	SELECT @RESULT AS [RESULT],@MESSAGE AS [MESSAGE]
END
