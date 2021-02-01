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

/********************************************************************************************************/
-- SP_SC_NEGO_HEADERS - NEGO_PROGRESS_STATUS_CODE
/********************************************************************************************************/
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

/********************************************************************************************************/
-- UPDATE | TABLE SP_SC_NEGO_HEADERS | FIELD award_method_code
/********************************************************************************************************/
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - SP_SC_NEGO_HEADERS
SELECT DISTINCT award_method_code FROM SP_SC_NEGO_HEADERS NH WHERE 1=1
-- and nego_header_id = 4
-- AND award_method_code = '010'
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - AWARD_METHOD_CODE
SELECT DISTINCT award_method_code FROM SP_SC_NEGO_AWARD_METHOD_CODE NH WHERE 1=1
-- AND award_method_code = '010'
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT MAP(floor(2*Rand()+1),1,'LPS',2,'MS',NULL) FROM DUMMY
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
UPDATE SP_SC_NEGO_HEADERS NH 
 SET award_method_code = MAP(floor(2*Rand()+1),1,'LPS',2,'MS',NULL)
 WHERE 1=1
 AND award_method_code IS NULL
;

/********************************************************************************************************/
-- UPDATE | TABLE SP_SC_NEGO_HEADERS | TO FIELD buyer_empno | FROM RANDOM SP_SC_EMPLOYEE_VIEW-EMPLOYEE_NUMBER
/********************************************************************************************************/
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
MERGE INTO SP_SC_NEGO_HEADERS NH USING 
(select EV.ROWNUM,EV.EMPLOYEE_NUMBER, NH.* from 
( select cast(floor(1000*rand()+1) as integer)as random,* from "SP_SC_NEGO_HEADERS" ) NH  inner join 
(select cast(row_number() over() as integer) as rownum, * from "SP_SC_EMPLOYEE_VIEW" where tenant_id ='L2100') EV
ON NH.tenant_id = EV.tenant_id and NH.random = EV.rownum ) NH_BASE
on NH.tenant_id = NH_BASE.tenant_id and NH.nego_header_id = NH_BASE.nego_header_id
 WHEN MATCHED THEN UPDATE SET NH.buyer_empno = NH_BASE.EMPLOYEE_NUMBER
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT buyer_empno,* FROM SP_SC_NEGO_HEADERS WHERE 1=1 
-- AND FIELD = "VALUE"
;

/********************************************************************************************************/
-- UPDATE | TABLE SP_SC_NEGO_HEADERS | FIELD 
/********************************************************************************************************/
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