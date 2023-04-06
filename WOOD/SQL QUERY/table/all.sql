DROP TABLE [wood].[OPT_CONDITIONS]
CREATE TABLE [wood].[OPT_CONDITIONS](
	[ID] [int] IDENTITY(100000,1) NOT NULL,
	[CODE] [varchar](300) NULL,
	[HESO] [float] NULL,
	[DESCRIPTION] [nvarchar](max) NULL,
	[TYPE] [varchar](150) NULL,
	[INPUT_TYPE_ID] [int] NULL,
	[PAY_RATE] [float] NULL
)

DROP TABLE [wood].[OPT_MAP_CONDITION]
CREATE TABLE [wood].[OPT_MAP_CONDITION](
	[REGION_ID] [int] NOT NULL,
	[COND_ID] [int] NOT NULL,
	[ID] [int] IDENTITY(100000,1) NOT NULL
)

DROP TABLE [wood].[WOOD_INSP]
CREATE TABLE [wood].[WOOD_INSP](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NULL ,
	[RECEIPT_ID] [int] NOT NULL,
	[SIZE_OUT_RATE] [float] NULL,
	[SAMPLE_QTY] [int] NOT NULL,
	[A1_RATE] [float] NULL,
	[NONLI_RATE] [float] NULL,
	[LUONLI_RATE] [float] NULL,
	[HUMIDITY_RATE] [float] NULL,
	[INS_NOTE] [nvarchar](500) NULL,
	[CREATE_BY] [int] NULL,
	[CREATE_AT] [datetime] NULL,
	[UPDATE_BY] [int] NULL,
	[UPDATE_AT] [datetime] NULL,
	[RATE_B] [float] NULL,
	[RATE_C] [float] NULL,
	[RATE_A] [float] NULL,
	[HEIGHT_OUT_RATE] [float] NULL,
	[MC_RATE] [float] NULL
)

DROP TABLE [wood].[WOOD_INSPECTION]
CREATE TABLE [wood].[WOOD_INSPECTION](
	[ID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[INPUT_TYPE_ID] [int] NULL,
	[RECEIPT_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[NOTE] [nvarchar](200) NULL,
	[SIZE_OUT_RATE] [float] NULL,
	[HUMIDITY] [float] NULL,
	[IS_DOUBLE] [nchar](10) NULL,
	[DEL_FLAG] [nchar](10) NULL,
	[CREATE_AT] [datetime] NULL,
	[CREATE_BY] [int] NULL,
	[UPDATE_AT] [datetime] NULL,
	[UPDATE_BY] [int] NULL,
	[DEFECT_QTY] [int] NULL,
	[WTYPE] [int] NULL,
	[DTYPE] [nchar](10) NULL,
	[RATE_NONLI] [float] NULL,
	[RATE_A1] [float] NULL,
	[HEIGHT_OUT_RATE] [float] NULL,
	[PAY_RATE] [float] NULL
)
DROP TABLE [wood].[WOOD_PAY_CALCULATOR]
CREATE TABLE [wood].[WOOD_PAY_CALCULATOR](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[INPUT_TYPE_ID] [int] NULL,
	[RECEIPT_ID] [int] NULL,
	[ITEM_ID] [int] NULL,
	[NOTE] [nvarchar](200) NULL,
	[SIZE_OUT_RATE] [float] NULL,
	[HUMIDITY] [float] NULL,
	[IS_DOUBLE] [nchar](10) NULL,
	[DEL_FLAG] [nchar](10) NULL,
	[COMPANY_PRICE] [int] NULL,
	[ITYPE_PRICE] [int] NULL,
	[AVERAGE_PRICE] [int] NULL,
	[CREATE_AT] [datetime] NULL,
	[CREATE_BY] [int] NULL,
	[UPDATE_AT] [datetime] NULL,
	[UPDATE_BY] [int] NULL,
	[DTYPE] [nchar](10) NULL,
	[WTYPE] [int] NULL,
	[DIFF] [float] NULL,
	[INS_RATE] [float] NULL,
	[PAY_RATE] [float] NULL,
	[GOOD_QTY] [int] NULL,
	[SAMPLE_QTY] [int] NULL,
	[TOTAL_QTY] [int] NULL,
	[QCTT_VOLUMN] [float] NULL,
	[QC_VOLUMN] [float] NULL,
	[WH_VOLUMN] [float] NULL,
	[AMOUNT] [int] NULL,
	[CID] [int] NULL,
	[ICODE] [nchar](10) NULL,
	[PARENTID] [int] NULL
)
DROP TABLE [wood].[WOOD_PAY_SAVE]
CREATE TABLE [wood].[WOOD_PAY_SAVE](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[RECEIPT_ID] [int] NULL,
	[IS_INVOICE] [bit] NULL,
	[IS_COC] [bit] NULL,
	[SHIPPING_FEE] [int] NULL,
	[OTHER_SUPPORT_FEE] [int] NULL,
	[TOTAL_PAY] [bigint] NULL,
	[AVERAGE_PRICE] [int] NULL,
	[WH_VOLUMN] [float] NULL,
	[QC_VOLUMN] [float] NULL,
	[INPUT_RATE] [float] NULL,
	[PAY_RATE] [float] NULL,
	[TOTAL_NOT_TAX] [int] NULL,
	[APPROVAL_STATUS] [int] NULL,
	[CREATE_AT] [datetime] NULL,
	[CREATE_BY] [int] NULL,
	[MANUAL] [int] NULL
)
DROP TABLE [wood].[PRICE_TYPE]
CREATE TABLE [wood].[PRICE_TYPE](
	[CODE] [nchar](10) NULL,
	[NAME] [nvarchar](200) NULL,
	[MODULE_ID] [int] NULL,
	[MODULE] nvarchar(300) NULL
)
DROP TABLE [wood].[REGION]
CREATE TABLE [wood].[REGION](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[CODE] [varchar](30) NOT NULL,
	[NAME] [nvarchar](100) NOT NULL,
	[DESCRIPTIONS] [nvarchar](400) NULL,
	[MODULE_ID] [int] NULL,
	[MODULE] nvarchar(300) NULL
)
DROP TABLE [wood].[REGION_SHIPPING]
CREATE TABLE [wood].[REGION_SHIPPING](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[CODE] [varchar](30) NOT NULL,
	[NAME] [nvarchar](100) NOT NULL,
	[DESCRIPTIONS] [nvarchar](400) NULL,
	[MODULE_ID] [int] NULL
)
DROP TABLE [wood].[REQ_PRICE]
CREATE TABLE [wood].[REQ_PRICE](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[CREATED_AT] [datetime] NULL,
	[CREATED_BY] [int] NULL,
	[APPROVAL_STATUS] [int] NULL,
	[APPROVAL_AT] [datetime] NULL,
	[APPROVAL_BY] [int] NULL,
	[REQ_NOTE] [nvarchar](300) NULL,
	[APPROVAL_NOTE] [nvarchar](300) NULL
)

DROP TABLE [wood].[WH_INPUT_TYPE]
CREATE TABLE [wood].[WH_INPUT_TYPE](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[CODE] [varchar](30) NULL,
	[ITYPE] [varchar](20) NULL,
	[NAME] [nvarchar](140) NULL,
	[MODULE_ID] [int] NULL,
	[MODULE] nvarchar(300) NULL
)
DROP TABLE  [wood].[WH_RECEIPT]
CREATE TABLE [wood].[WH_RECEIPT](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[NUMBER_OF_MONTH] [int] NOT NULL,
	[MONTH] [int] NOT NULL,
	[YEAR] [int] NOT NULL,
	[WAREHOUSE_ID] [int] NOT NULL,
	[VENDOR_ID] [int] NOT NULL,
	[QC_STAFF] [int] NULL,
	[CAR_LICENSE_PLATE] [varchar](50) NULL,
	[ALLOW_INSPECTION] [bit] NULL,
	[ALLOW_PAY] [bit] NULL,
	[MODULE_ID] [int] NULL,
	[RECEIPT_DATE] [datetime] NULL,
	[CREATE_AT] [datetime] NULL,
	[FORKLIFT] [bit] NULL,
	[CREATE_BY] [int] NULL,
	[DEL_FLAG] [nchar](10) NULL,
	[LOCK] [int] NULL
) 
DROP TABLE [wood].[WH_RECEIPT_DTL]
CREATE TABLE [wood].[WH_RECEIPT_DTL](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[WH_RECEIPT_ID] [int] NOT NULL,
	[ITEM_ID] [int] NOT NULL,
	[PCS_PER_PACKAGE] [int] NULL,
	[PACKAGE_QUANTITY] [int] NULL,
	[INPUT_TYPE_ID] [int] NULL,
	[NOTE] [nvarchar](300) NULL,
	[RETURN_ID] [int] NULL,
	[LEAVE] [nchar](10) NULL,
	[OVER_PLAN] [bit] NULL,
	[SAMPLE_PACKAGE_QUANTITY] [int] NULL,
	[SAMPLE_QUANTITY] [int] NULL,
	[DEL_FLAG] [nchar](10) NULL,
	[CREATE_AT] [datetime] NULL,
	[CREATE_BY] [int] NULL,
	[MODIFY_AT] [datetime] NULL,
	[MODIFY_BY] [int] NULL,
	[DTYPE] [nchar](10) NULL,
	[WTYPE] [int] NULL
)

DROP TABLE [wood].[WOOD_TYPE]
CREATE TABLE [wood].[WOOD_TYPE](
	[ID] [int] IDENTITY(100000,1) NOT NULL PRIMARY KEY,
	[GUID] [uniqueidentifier] DEFAULT NEWID() NOT NULL,
	[CODE] [varchar](30) NOT NULL,
	[NAME] [nvarchar](100) NOT NULL,
	[DESCRIPTION] [nvarchar](400) NULL
)