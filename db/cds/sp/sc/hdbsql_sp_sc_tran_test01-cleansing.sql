/** https://vscode-sqltools.mteixeira.dev/features/codelens */
-- @conn sppDb_hdi_dev_RT

-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 
BUERY_EMPNO
-- , * 
FROM SP_SC_NEGO_HEADERS NH LEFT OUTER JOIN MANY TO ON CM_HR_EMPLOYEE HE 
ON NH.TENANT_ID = HE.TENANT_ID AND NH.TENANT_ID = HE.TENANT_ID 
WHERE 1=1 
-- AND FIELD = "VALUE"
;

-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 
BUERY_EMPNO
-- , * 
FROM SP_SC_NEGO_HEADERS WHERE 1=1 
-- AND FIELD = "VALUE"
;


-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
UPDATE SP_SC_NEGO_HEADERS NH 
 SET NEGO_PROGRESS_STATUS_CODE = IFNULL(NPSC.NEGO_PROGRESS_STATUS_CODE, '060') FROM SP_SC_NEGO_HEADERS NH
 INNER JOIN SP_SC_NEGO_PROGRESS_STATUS_CODE_VIEW AS NPSC 
 ON NH.NEGO_PROGRESS_STATUS_CODE = NPSC.NEGO_PROGRESS_STATUS_NAME
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
call sys.GET_INSUFFICIENT_PRIVILEGE_ERROR_DETAILS('F3844D24DES02B418B9977692D85A0B4',?);
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;