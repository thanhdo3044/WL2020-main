
SELECT CONCAT('ALTER SCHEMA prod TRANSFER [dbo].[',T.[name],']')
FROM sys.tables T
LEFT JOIN sys.schemas S ON S.schema_id = T.schema_id
WHERE T.schema_id = 1