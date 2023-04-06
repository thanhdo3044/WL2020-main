CREATE OR ALTER FUNCTION nlg.Func_lay_thu_hien_theo_ncc(
	@MANCC INT,@NGAY_NHAP_KHO DATETIME,@QUI_CACH_ID INT
)
RETURNS FLOAT
AS
BEGIN
	DECLARE @TH FLOAT,@MONTH INT, @YEAR INT
	SELECT @MONTH = DATEPART(MONTH,@NGAY_NHAP_KHO) , @YEAR=DATEPART(YEAR,@NGAY_NHAP_KHO)
	SELECT @TH = ROUND(SUM(SOBO*SOTHANHBO*QC.VOLUMN),4) 
	FROM nlg.PHIEUNHAPKHO_DT AS PT
	JOIN nlg.QUICACH AS QC ON QC.ID=PT.ID_QUICACH
	JOIN nlg.GROUP_QUICACH as GRQ ON GRQ.ID = QC.GROUP_ID
	JOIN nlg.PHIEUNHAPKHO AS PN ON PN.ID = PT.SOPHIEU_ID
	WHERE GRQ.ID=(SELECT GROUP_ID FROM nlg.QUICACH WHERE ID=@QUI_CACH_ID)
	AND DATEPART(MONTH,PN.RECEIPT_DATE) = @MONTH AND DATEPART(YEAR,PN.RECEIPT_DATE) = @YEAR
	AND PN.MANCC = @MANCC AND PT.OVER_PLAN =0 AND PT.DEL_FLAG='N' AND PT.DELAI='N'

	RETURN @TH
END