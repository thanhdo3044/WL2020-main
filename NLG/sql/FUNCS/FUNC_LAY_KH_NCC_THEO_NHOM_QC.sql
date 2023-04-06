CREATE or alter FUNCTION nlg.Func_lay_kh_ncc_theo_nhom_qui_cach(
	@PHIEU_NHAP_KHO_ID INT,@GROUP_CODE_ID INT
)
RETURNS FLOAT
AS
BEGIN
	DECLARE @MANCC INT,@NGAY_NHAP_KHO DATETIME,@YEAR INT,@MONTH INT,@KH_THANG FLOAT
	
	SELECT @MANCC = MANCC,@NGAY_NHAP_KHO=RECEIPT_DATE FROM nlg.PHIEUNHAPKHO WHERE ID=@PHIEU_NHAP_KHO_ID 
	SELECT @YEAR = DATEPART(YEAR,@NGAY_NHAP_KHO) , @MONTH = DATEPART(MONTH,@NGAY_NHAP_KHO)
	SELECT @KH_THANG =  SUM(PLANQTY) FROM  nlg.PLAN_NLG WHERE DATEPART(MONTH,CREATED_AT)=@MONTH AND DATEPART(YEAR,CREATED_AT) = @YEAR AND MANCC = @MANCC
	GROUP BY MANCC,GROUP_CODE
	RETURN @KH_THANG
END
