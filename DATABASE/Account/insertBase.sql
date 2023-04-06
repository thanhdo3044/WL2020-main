--SELECT * FROM base.ACCOUNT

INSERT INTO base.ACCOUNT (GUID,ACCOUNT,[PASSWORD],LAST_NAME,ROLE_ID)
SELECT NEWID(),ACCOUNT,[PASSWORD],NAME,ROLE_ID FROM dbo.ACCOUNT

INSERT INTO base.[ROLE] (GUID,CODE,NAME)
SELECT NEWID(),CODE,NAME FROM dbo.[ROLE]
--TRUNCATE TABLE base.ROLE_TYPE
INSERT INTO base.ROLE_TYPE(GUID,CODE,NAME)
SELECT NEWID(),CODE,NAME FROM dbo.[ROLE_TYPE]



INSERT INTO base.ROLE_VALUE(GUID,ROLE_ID,ROLE_TYPE_ID,[VALUE])
SELECT NEWID(),ROLE_ID,ROLE_TYPE,[VALUE] FROM dbo.[ROLE_VALUE]

--TRUNCATE TABLE base.ROLE_GROUP
INSERT INTO base.ROLE_GROUP([GUID],CODE,[NAME])
VALUES (NEWID(),'XS',N'Xếp sấy'), --0
(NEWID(),'LS',N'Lò sấy'), --1
(NEWID(),'TPL',N'Tạo Pallet'),--2
(NEWID(),'S',N'Step'),--3
(NEWID(),'DG',N'Đóng gói'),--4
(NEWID(),'QC',N'QC'),--5
(NEWID(),'C',N'Cắt'),--6
(NEWID(),'A',N'Admin'),--7
(NEWID(),'D',N'Dev'),--8
(NEWID(),'CS',N'Chờ sấy'), --9
(NEWID(),'K',N'Kho lựa phôi'),--10
(NEWID(),'CKT',N'Cắt khuyết tật')--11
/*
SELECT * FROM base.ROLE_VALUE
WHERE ROLE_ID = 100002

UPDATE base.ROLE_VALUE
SET [VALUE] = 100009
WHERE ID =100236
*/
--SELECT * FROM base.ROLE
INSERT INTO base.[ROLE_VALUE]([GUID],ROLE_ID,ROLE_TYPE_ID,[VALUE])
VALUES (NEWID(),100001,100003,100000),
(NEWID(), 100002,100003,100001),
(NEWID(), 100003,100003,100001),
(NEWID(), 100004,100003,100001),
(NEWID(), 100005,100003,100002),
(NEWID(), 100006,100003,100006),
(NEWID(), 100007,100003,1000010),
(NEWID(), 100008,100003,100002),
(NEWID(), 100009,100003,100003),
(NEWID(), 100010,100003,100003),
(NEWID(), 100011,100003,100003),
(NEWID(), 100012,100003,100003),
(NEWID(), 100013,100003,100003),
(NEWID(), 100014,100003,100003),
(NEWID(), 100015,100003,100003),
(NEWID(), 100016,100003,100003),
(NEWID(), 100017,100003,100003),
(NEWID(), 100018,100003,100003),
(NEWID(), 100019,100003,100002),
(NEWID(), 100020,100003,100003),
(NEWID(), 100021,100003,100003),
(NEWID(), 100022,100003,100003),
(NEWID(), 100023,100003,100003),
(NEWID(), 100024,100003,100002),
(NEWID(), 100025,100003,100004),
(NEWID(), 100026,100003,100009)


INSERT INTO base.STEP (GUID,DEPARTMENT_ID,CODE,NAME)
SELECT GUID,DEPARTMENT_ID,CODE,NAME FROM dbo.[STEP]

INSERT INTO base.DEPARTMENT (GUID,XUONG_ID,CODE,NAME)
SELECT GUID,XUONG_ID,CODE,NAME FROM dbo.[DEPARTMENT]

INSERT INTO base.XUONG (GUID,FACTORY_ID,CODE,NAME)
SELECT GUID,FACTORY_ID,CODE,NAME FROM dbo.[XUONG]

INSERT INTO base.FACTORY (GUID,CODE,NAME)
SELECT GUID,CODE,NAME FROM dbo.[FACTORY]

INSERT INTO base.ITEM (GUID,CODE,NAME,LENGTH,WIDTH,HEIGHT,TYPE_ID)
SELECT [GUID],CODE,NAME,LENGTH,WIDTH,HEIGHT,
CASE
    WHEN IS_SUPPLIES = 1 THEN 100000
    WHEN IS_WOOD = 1 THEN 100001
    WHEN IS_MATERIALS = 1 THEN 100002
    WHEN IS_PRODUCT = 1 THEN 100003
END AS TYPE_ID
FROM dbo.[ITEM]

INSERT INTO base.MARKET(GUID,PRODUCT_ID,CODE,NAME)
SELECT M.GUID,I.ID,MARKET_CODE,MARKET_NAME FROM dbo.[MARKET] M
LEFT JOIN dbo.[ITEM] I ON I.CODE = M.PRODUCT_CODE

INSERT INTO base.UNIT([GUID],CODE,NAME)
VALUES(NEWID(),'THANH',N'Thanh'),
(NEWID(),'TAM',N'Tấm'),
(NEWID(),'BO',N'Bộ'),
(NEWID(),'CHIEC',N'Chiếc'),
(NEWID(),'CAI',N'Cái'),
(NEWID(),'M3',N'Mét khối'),
(NEWID(),'ME',N'Mê')



