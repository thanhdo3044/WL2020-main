USE [Woodsland]
GO
/****** Object:  Table [base].[ACCOUNT]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[ACCOUNT](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[ACCOUNT] [varchar](50) NULL,
	[PASSWORD] [nvarchar](500) NULL,
	[FIRST_NAME] [nvarchar](200) NULL,
	[LAST_NAME] [nvarchar](200) NULL,
	[EMAIL] [varchar](200) NULL,
	[POSITION] [nvarchar](200) NULL,
	[PHONE] [varchar](100) NULL,
	[ADDRESS] [nvarchar](200) NULL,
	[ACTIVE] [int] NULL,
	[ROLE_ID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[DEPARTMENT]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[DEPARTMENT](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[XUONG_ID] [int] NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[FACTORY]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[FACTORY](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[GLOBAL_DATE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[GLOBAL_DATE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[YEAR] [varchar](50) NULL,
	[MONTH] [varchar](50) NULL,
	[WEEK] [varchar](50) NULL,
	[DAY] [varchar](50) NULL,
	[YEAR_MONTH] [varchar](50) NULL,
	[YEAR_WEEK] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[ITEM]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[ITEM](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL,
	[LENGTH] [money] NULL,
	[WIDTH] [money] NULL,
	[HEIGHT] [money] NULL,
	[TYPE_ID] [int] NULL,
	[UNIT_ID] [int] NULL,
	[IMAGE_URL] [nvarchar](500) NULL,
	[CREATE_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[ITEM_TYPE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[ITEM_TYPE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[MARKET]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[MARKET](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PRODUCT_ID] [int] NULL,
	[CODE] [varchar](100) NULL,
	[NAME] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[NOTIFICATION]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[NOTIFICATION](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[TITLE] [nvarchar](1000) NULL,
	[CONTENT] [nvarchar](max) NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [base].[PACKAGE_TYPE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[PACKAGE_TYPE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[PALLET_TYPE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[PALLET_TYPE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[ROLE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[ROLE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[ROLE_GROUP]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[ROLE_GROUP](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[ROLE_TYPE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[ROLE_TYPE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[ROLE_VALUE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[ROLE_VALUE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[ROLE_ID] [int] NULL,
	[ROLE_TYPE_ID] [int] NULL,
	[VALUE] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[STEP]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[STEP](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[DEPARTMENT_ID] [int] NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL,
	[DESCRIPTION] [nvarchar](500) NULL,
	[IMAGES_URL] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[UNIT]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[UNIT](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[VENDOR]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[VENDOR](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [nvarchar](200) NULL,
	[NAME] [nvarchar](200) NULL,
	[ACTIVE] [int] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[VERSION]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[VERSION](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[APP] [nvarchar](200) NULL,
	[CODE] [nvarchar](200) NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [base].[XUONG]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [base].[XUONG](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[FACTORY_ID] [int] NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOM]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOM](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[ITEM_ID] [int] NULL,
	[MATERIALS_ID] [int] NULL,
	[RATE] [money] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOM_SUPPLIES]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOM_SUPPLIES](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PRODUCT_ID] [int] NULL,
	[SUPPLIES_ID] [int] NULL,
	[RATE] [money] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DEPENDENT]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DEPENDENT](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[STEP_OF_PALLET_ID] [int] NULL,
	[VENDOR_ID] [int] NULL,
	[CHEMISTRY_ID] [int] NULL,
	[PARCEL_ID] [nvarchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ITEM_IN_PACKAGE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ITEM_IN_PACKAGE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PACKAGE_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[QUANTITY] [money] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ITEM_IN_PALLET]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ITEM_IN_PALLET](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PALLET_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[QUANTITY] [money] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ITEM_IN_PLAN]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ITEM_IN_PLAN](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PLAN_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[ITEM_CODE] [varchar](50) NULL,
	[QUANTITY] [money] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KILN]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KILN](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KILN_BATCH]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KILN_BATCH](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[NUMBER] [int] NULL,
	[YEAR] [varchar](10) NULL,
	[WEEK] [varchar](10) NULL,
	[KILN_ID] [int] NULL,
	[STEP_NEXT_ID] [int] NULL,
	[TIME_OUT_REAL] [int] NULL,
	[TIME_OUT_TARGET] [int] NULL,
	[LENGTH] [money] NULL,
	[HEIGHT] [nvarchar](50) NULL,
	[VERIFY] [int] NULL,
	[VERIFY_BY] [int] NULL,
	[HUMIDITY] [nvarchar](100) NULL,
	[STATE] [nvarchar](500) NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[EXPORT_BY] [int] NULL,
	[EXPORT_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MATERIALS_IN_PACKAGE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MATERIALS_IN_PACKAGE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[ITEM_IN_PACKAGE_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[QUANTITY] [money] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NOTIFICATION]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NOTIFICATION](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[TITLE] [nvarchar](1000) NULL,
	[CONTENT] [nvarchar](max) NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ORDER]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ORDER](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[STATUS] [nvarchar](500) NULL,
	[ORDER] [nvarchar](500) NULL,
	[ART_NO] [nvarchar](500) NULL,
	[DESCRIPTION] [nvarchar](500) NULL,
	[PLAN_WEEK] [nvarchar](500) NULL,
	[TOT_ORD] [nvarchar](500) NULL,
	[TOT_BAL] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PACKAGE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PACKAGE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[STEP_OF_PALLET_ID] [int] NULL,
	[SOURCE_ID] [int] NULL,
	[DESTINATION_ID] [int] NULL,
	[ITEM_FROM_ID] [int] NULL,
	[TYPE_ID] [int] NULL,
	[REMEDIES_ID] [int] NULL,
	[DESCRIPTION] [nvarchar](1000) NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[VERIFY_BY] [int] NULL,
	[VERIFY_DATE] [datetime] NULL,
	[KH_VERIFY_BY] [int] NULL,
	[KH_VERIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PACKAGE_TYPE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PACKAGE_TYPE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](500) NULL,
	[TYPE_ID] [int] NULL,
	[DESCRIPTION] [nvarchar](500) NULL,
	[IMAGES_URL] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PALLET]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PALLET](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](20) NULL,
	[NUMBER] [int] NULL,
	[YEAR] [varchar](10) NULL,
	[WEEK] [varchar](10) NULL,
	[TYPE_ID] [int] NULL,
	[PARCEL] [nvarchar](100) NULL,
	[ENV] [nvarchar](100) NULL,
	[VENDOR_ID] [int] NULL,
	[CUSTOMER_ID] [int] NULL,
	[GLUE] [nvarchar](500) NULL,
	[CHEMISTRY] [nvarchar](500) NULL,
	[IKEA_CODE] [varchar](100) NULL,
	[IKEA_GUID] [varchar](100) NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PALLET_STATE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PALLET_STATE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PALLET_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[QUANTITY] [money] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PALLET_SUPPLIES]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PALLET_SUPPLIES](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PALLET_ID] [int] NULL,
	[SUPPLIES_ID] [int] NULL,
	[QUANTITY] [money] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PARCEL]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PARCEL](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [nvarchar](200) NULL,
	[ACTIVE] [int] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PERMISSION]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PERMISSION](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PLAN]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PLAN](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[YEAR] [varchar](20) NULL,
	[WEEK] [varchar](20) NULL,
	[STEP_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[QUANTITY] [money] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PLAN_ID]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PLAN_ID](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[STEP_ID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RANGE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RANGE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[TYPE] [nvarchar](100) NULL,
	[HEIGHT] [nvarchar](100) NULL,
	[CODE] [nvarchar](100) NULL,
	[TIME_OUT_TARGET] [int] NULL,
	[STEP_NEXT_ID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REMEDIES]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REMEDIES](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[TYPE_ID] [int] NULL,
	[CODE] [varchar](200) NULL,
	[NAME] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REQUIRE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REQUIRE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PALLET_ID] [int] NULL,
	[STEP_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[QUANTITY] [money] NULL,
	[REAL] [money] NULL,
	[ERROR_TYPE_ID] [int] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[QC_VERIFY_BY] [int] NULL,
	[QC_VERIFY_DATE] [datetime] NULL,
	[KH_VERIFY_BY] [int] NULL,
	[KH_VERIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ROUTING]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ROUTING](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[ITEM_ID] [int] NULL,
	[STEP_ID] [int] NULL,
	[ORDER] [int] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[STEP_OF_PALLET]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[STEP_OF_PALLET](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[PALLET_ID] [int] NULL,
	[STEP_ID] [int] NULL,
	[STEP_NEXT_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[PASS] [money] NULL,
	[NOT_PASS] [money] NULL,
	[KILN_BATCH_ID] [int] NULL,
	[PLAN_ID] [int] NULL,
	[FINISH] [int] NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[STEP_ORDER]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[STEP_ORDER](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[STEP_ID] [int] NULL,
	[ORDER] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TABLE]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TABLE](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](50) NULL,
	[NAME] [nvarchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WORK_CENTER]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WORK_CENTER](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[STEP_ID] [int] NULL,
	[WORK_RESOURCES_ID] [int] NULL,
	[WORK_RESOURCES_QUANTITY] [int] NULL,
	[ITEM_ID] [int] NULL,
	[QUANTITY_PER_CYCLE] [money] NULL,
	[TIME_PER_CYCLE] [varchar](30) NULL,
	[WORKERS] [int] NULL,
	[ACTIVE] [int] NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[CREATE_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WORK_RESOURCES]    Script Date: 10/12/2019 7:48:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WORK_RESOURCES](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[GUID] [uniqueidentifier] NOT NULL,
	[CODE] [varchar](100) NULL,
	[NAME] [nvarchar](200) NULL,
	[CREATE_DATE] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[CREATE_BY] [int] NULL,
	[MODIFY_DATE] [datetime] NULL
) ON [PRIMARY]
GO
