CREATE OR ALTER VIEW nlg.Danh_Sach_Phieu_Nhap_Kho
AS
SELECT PN.ID,PN.[GUID],PN.[MONTH],PN.[YEAR],PN.[BIENSOXE],PN.[DEL_FLAG],PN.[HACAP],
PN.[TINHTIEN],PN.[XUONGXENANG],PN.[CREATE_DATE],PN.[RECEIPT_DATE],PR.[CODE] AS [MANCC],PR.[NAME] AS [NCC_NAME],
DP.CODE AS MAKHO ,DP.[NAME]+' - '+DP.[CODE] AS [TEN_KHO],AC.LAST_NAME AS [NGUOI_TAO],AD.[LAST_NAME] AS [QC_NAME] ,
CONVERT(VARCHAR(300),PN.[YEAR])+'.'+PN.NUM+'/'+CONVERT(VARCHAR(300),PN.[MONTH])+DP.CODE AS [SOPHIEU],PN.DEL_FLAG AS [DEL],PR.COC,PR.COHD,
pr.ADDRESS AS [NCC_ADDRESS]
FROM nlg.PHIEUNHAPKHO AS PN
JOIN nlg.PROVIDERS AS PR ON PR.ID = PN.MANCC
JOIN base.DEPARTMENT AS DP ON DP.ID = PN.MAKHO
JOIN base.ACCOUNT AS AC ON AC.ID = PN.CREATE_BY
JOIN base.ACCOUNT AS AD ON AD.ID = PN.QC_STAFF

