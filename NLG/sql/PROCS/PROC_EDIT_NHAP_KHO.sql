CREATE OR ALTER PROC nlg.Proc_edit_nhap_kho_detail
	@DETAIL_ID INT,@SOTHANH INT, @SOTHANH_BO INT,@QC_ID INT,@NOTE NVARCHAR(300),@DELAI NCHAR(10),@DEL_FLAG Varchar(10),@SLMAU INT
AS
BEGIN
	
	DECLARE @KHOI_LUONG_MOI FLOAT,@KHOI_LUONG_CU FLOAT,@KH_NCC FLOAT,@TH_NCC  FLOAT,
	@MANCC INT,@SOPHIEU_ID INT,@GROUP_QC_ID INT,@QC_CU_ID INT,@NGAY_NHAP_KHO DATETIME,
	@MAX_VOLUMN_AVAILABLE FLOAT,@RESULT BIT,@MESSAGE NVARCHAR(300)
	IF(@SLMAU>0)
	BEGIN
		UPDATE nlg.PHIEUNHAPKHO_DT SET SLMAU=@SLMAU WHERE ID = @DETAIL_ID
		SELECT @RESULT = 1, @MESSAGE = N'Thành công !'
	END
	ELSE 
	BEGIN
		IF(@DELAI='Y' OR @DEL_FLAG='Y')
		BEGIN
			UPDATE nlg.PHIEUNHAPKHO_DT SET SOBO=@SOTHANH,SOTHANHBO=@SOTHANH_BO,NOTE=@NOTE,DELAI=@DELAI,DEL_FLAG='Y' WHERE ID = @DETAIL_ID
				SELECT @RESULT = 1, @MESSAGE = N'Thành công !'
			END
		ELSE
			BEGIN
				SELECT @QC_CU_ID = ID_QUICACH FROM PHIEUNHAPKHO_DT WHERE ID =@DETAIL_ID
				SELECT @KHOI_LUONG_CU = ROUND(SOBO*SOPHIEU_ID*QC.VOLUMN,4) ,
				@KHOI_LUONG_MOI =ROUND(@SOTHANH*@SOTHANH_BO*QC.VOLUMN,4),
				@SOPHIEU_ID = PT.SOPHIEU_ID
				FROM nlg.PHIEUNHAPKHO_DT AS PT
				JOIN nlg.QUICACH AS QC ON QC.ID = PT.ID_QUICACH
				WHERE PT.ID= @DETAIL_ID
				-- NẾU KHÔNG SỬA QUI CÁCH
				-- THÌ KIỂM TRA KHỐI LƯỢNG
				SELECT @GROUP_QC_ID = GROUP_ID FROM nlg.QUICACH WHERE ID = @QC_ID
				SELECT @NGAY_NHAP_KHO = RECEIPT_DATE,@MANCC=MANCC FROM nlg.PHIEUNHAPKHO WHERE ID =@SOPHIEU_ID
				SELECT @KH_NCC = nlg.Func_lay_kh_ncc_theo_nhom_qui_cach(@SOPHIEU_ID,@GROUP_QC_ID)
				SELECT @TH_NCC = nlg.Func_lay_thu_hien_theo_ncc(@MANCC,@NGAY_NHAP_KHO,@QC_ID)
				-- KIỂM TRA NẾU KHỐI LƯỢNG SAU KHI SỬA MÀ NHỎ HƠN KHỐI LƯỢNG HIỆN TẠI
				-- THÌ KHÔNG CẦN VALIDATE PLAN NỮA
				IF (@KHOI_LUONG_MOI<=@KHOI_LUONG_CU)
					BEGIN
					-- CHO PHÉP UPDATE
						UPDATE nlg.PHIEUNHAPKHO_DT SET SOBO=@SOTHANH,SOTHANHBO=@SOTHANH_BO,NOTE=@NOTE,DELAI=@DELAI WHERE ID = @DETAIL_ID
						SELECT @RESULT = 1, @MESSAGE = N'Thành công !'
					END
				ELSE
				-- NGƯỢC LẠI , NẾU KHỐI LƯỢNG SAU SỬA LỚN HƠN KHỐI LƯỢNG CŨ
				-- THÌ PHẢI KIỂM TRA SO KẾ HOẠCH
				-- NẾU VƯỢT KẾ HOẠCH -> KHÔNG CHO SỬA, VÀ BÁO SỐ LƯỢNG TỐI ĐA CÓ THỂ SỬA
					BEGIN
						IF(@KHOI_LUONG_MOI+@TH_NCC<=@KH_NCC)
							BEGIN
								UPDATE nlg.PHIEUNHAPKHO_DT SET SOBO=@SOTHANH,SOTHANHBO=@SOTHANH_BO,NOTE=@NOTE WHERE ID = @DETAIL_ID
								SELECT @RESULT = 1, @MESSAGE = N'Thành công !'
							END
						ELSE
							BEGIN
								SELECT @MAX_VOLUMN_AVAILABLE = @KH_NCC - @TH_NCC
								SELECT @RESULT = 0
							END
					END
			END
	END
	

		SELECT @RESULT AS [RESULT],@MESSAGE AS [MESSAGE]
END