-- @block Bookmarked query
-- @group SP_SC
-- @name SP_SC_NEGO_TYPE_CODE
select * from SP_SC_NEGO_TYPE_CODE;

-- @block Bookmarked query
-- @group SP_SC
-- @name SP_SC_OUTCOME_CODE
select * from SP_SC_OUTCOME_CODE;

-- @block Bookmarked query
-- @group SP_SC
-- @name SP_SC_AWARD_TYPE_CODE - 폐기예정
select * from SP_SC_AWARD_TYPE_CODE;

-- @block Bookmarked query
-- @group SP_SC
-- @name SP_SC_AWARD_TYPE_CODE_VIEW - 
select * from SP_SC_AWARD_TYPE_CODE_VIEW;

-- @block Bookmarked query
-- @group SP_SC
-- @name SP_SC_AWARD_TYPE_CODE - 
select * from SP_SC_AWARD_METHOD_CODE_VIEW;

-- @block Bookmarked query
-- @group SP_SC
-- @name SP_SC_AWARD_TYPE_CODE - 
select * from SP_SC_NEGO_AWARD_METHOD_CODE;

-- @block Bookmarked query
-- @group SP_SC
-- @name SP_SC_EMPLOYEE_VIEW - 사원번호(CM_HR_EMPLOYEE=+CM_HR_DEPARTMENT)
select * from SP_SC_EMPLOYEE_VIEW;


-- @block Bookmarked query
-- @group Common
-- @name Contents to Csv
DO BEGIN
DECLARE OBJECT_NAME NVARCHAR(255) DEFAULT 'SP_SC_NEGO_AWARD_METHOD_CODE';
DECLARE SQL_STRING NVARCHAR(3000) DEFAULT '';
DECLARE STRING_CSV NVARCHAR(9000) DEFAULT '';
DECLARE CREATED INT DEFAULT 0;
SQL_STRING = 'EXPORT '||OBJECT_NAME||' AS CSV INTO "#CLIENT_EXPORT_1585101237059" WITH REPLACE NO DEPENDENCIES THREADS 8' ;
CREATED := 0;
SELECT COUNT(*) INTO CREATED FROM M_TEMPORARY_TABLES 
WHERE SCHEMA_NAME = CURRENT_SCHEMA AND CONNECTION_ID = CURRENT_CONNECTION 
AND TABLE_NAME = '#CLIENT_EXPORT_1585101237059' AND IS_TEMPORARY = 'TRUE';
IF (:CREATED > 0) THEN
	DROP TABLE #CLIENT_EXPORT_1585101237059;
END IF;
CREATE LOCAL TEMPORARY TABLE "#CLIENT_EXPORT_1585101237059" (FILENAME VARCHAR(64), PATH VARCHAR(255), CONTENT CLOB);
--EXEC 'EXPORT SP_SC_EVALUATION_TYPE_CODE AS CSV INTO "#CLIENT_EXPORT_1585101237059" WITH REPLACE NO DEPENDENCIES THREADS 8' ;
EXEC SQL_STRING;
-- SELECT CONTENT FROM #CLIENT_EXPORT_1585101237059 WHERE FILENAME = 'data.csv';
--#######################################################################
WITH OBJECT_COLUMNS AS (
SELECT OBJECT_TYPE, SCHEMA_NAME, OBJECT_NAME, COLUMN_NAME, POSITION, COMMENTS FROM (
    SELECT 'TABLE' OBJECT_TYPE, SCHEMA_NAME, TABLE_NAME OBJECT_NAME, COLUMN_NAME, POSITION, COMMENTS FROM "PUBLIC"."TABLE_COLUMNS" UNION ALL
    SELECT 'VIEW'  OBJECT_TYPE, SCHEMA_NAME, VIEW_NAME OBJECT_NAME, COLUMN_NAME, POSITION, COMMENTS FROM "PUBLIC"."VIEW_COLUMNS" 
) ORDER BY OBJECT_TYPE, SCHEMA_NAME, OBJECT_NAME, POSITION )
, OBJECT_COLUMN_HEADER AS (
--SELECT * FROM OBJECT_COLUMNS WHERE
SELECT STRING_AGG(ESCAPE_DOUBLE_QUOTES(COLUMN_NAME), ',' ORDER BY POSITION) AS COLUMN_HEADER
FROM OBJECT_COLUMNS WHERE OBJECT_NAME = :OBJECT_NAME
GROUP BY OBJECT_TYPE, SCHEMA_NAME, OBJECT_NAME )
, OBJECT_COLUMN_DATA AS ( SELECT CONTENT COLUMN_DATA FROM #CLIENT_EXPORT_1585101237059 WHERE FILENAME = 'data.csv' )
--#######################################################################
SELECT COLUMN_HEADER||char(10)||COLUMN_DATA FROM OBJECT_COLUMN_HEADER, OBJECT_COLUMN_DATA;
END;


