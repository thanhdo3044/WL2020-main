CREATE OR ALTER PROC nlg.Proc_Create_Phieu_Nhap_Kho
@BSX NVARCHAR(300),@XENANG VARCHAR(10),@RECEIPT_DATE DATETIME,@MANCC INT,@MAKHO INT,@UID INT,@GUID VARCHAR(300)
AS
BEGIN
	DECLARE @NUM_OF_MONTH INT,@YEAR INT,@MONTH INT,@NUMFORMAT NVARCHAR(30),@MONTH_FORMAT NVARCHAR(30)
	SELECT @MONTH = DATEPART(MONTH,@RECEIPT_DATE) ,@YEAR = DATEPART(YEAR,@RECEIPT_DATE)
	SELECT @NUM_OF_MONTH = MAX(CONVERT(INT,NUM))+1 FROM nlg.PHIEUNHAPKHO WHERE [YEAR]=@YEAR AND [MONTH]=@MONTH AND MAKHO = @MAKHO
	IF(@NUM_OF_MONTH IS NULL)
		SET @NUM_OF_MONTH=1
	IF @NUM_OF_MONTH<10
		SELECT @NUMFORMAT = '0'+CONVERT(VARCHAR(10),@NUM_OF_MONTH)
	ELSE
		SELECT @NUMFORMAT = @NUM_OF_MONTH
	SELECT @MONTH_FORMAT=@MONTH
	IF(@MONTH<10)
		SELECT @MONTH_FORMAT='0'+CONVERT(VARCHAR(10),@MONTH)
	BEGIN TRY
		INSERT INTO nlg.PHIEUNHAPKHO([GUID],[NUM],[MONTH],[YEAR],[BIENSOXE],[DEL_FLAG],[HACAP],[TINHTIEN],[XUONGXENANG],[CREATE_DATE],[CREATE_BY],[RECEIPT_DATE],[MAKHO],[MANCC],[QC_STAFF])
		VALUES(@GUID,@NUMFORMAT,@MONTH_FORMAT,@YEAR,@BSX,'N','Y','N',@XENANG,GETDATE(),@UID,@RECEIPT_DATE,@MAKHO,@MANCC,@UID)
		SELECT TOP 1 * FROM nlg.PHIEUNHAPKHO WHERE [GUID] = @GUID ORDER BY ID DESC
	END TRY
	BEGIN CATCH
		SELECT   
        ERROR_NUMBER() AS ErrorNumber  
       ,ERROR_MESSAGE() AS ErrorMessage;
	END CATCH

END
