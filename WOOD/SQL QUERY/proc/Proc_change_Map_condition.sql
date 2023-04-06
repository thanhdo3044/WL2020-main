create or ALTER   Proc [wood].[Proc_Change_Map_Condition](
	@REGION_ID INT,@CONDITION_ID INT, @MAP_ID INT
)
AS
BEGIN
	DECLARE @RESULT AS BIT, @MESSAGE AS NVARCHAR(200)
	IF EXISTS (SELECT * FROM wood.OPT_MAP_CONDITION WHERE REGION_ID=@REGION_ID AND COND_ID=@CONDITION_ID)
		BEGIN
		--UPDATE
			BEGIN TRY
				DELETE FROM wood.OPT_MAP_CONDITION WHERE ID = @MAP_ID
				SELECT @RESULT =1 ,@MESSAGE =  N'THÀNH CÔNG !'
			END TRY
			BEGIN CATCH
				SELECT @RESULT=0,@MESSAGE =ERROR_MESSAGE()
			END CATCH
		END
	ELSE
		BEGIN
		--INSERT
			BEGIN TRY
				INSERT INTO wood.OPT_MAP_CONDITION(REGION_ID,COND_ID) VALUES(@REGION_ID,@CONDITION_ID)
				SELECT @RESULT =1 ,@MESSAGE =  N'THÀNH CÔNG !'
			END TRY
			BEGIN CATCH
			SELECT @RESULT=0,@MESSAGE =ERROR_MESSAGE()
			END CATCH
		END
	SELECT @RESULT AS [RESULT],@MESSAGE AS [MESSAGE]
END
