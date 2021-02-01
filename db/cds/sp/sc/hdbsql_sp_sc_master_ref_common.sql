/*
견적계획 -  Line	Incoterms	N	CM_CODE_MST-OP_INCOTERMS	공통코드에 등록되어 있음 화면에 List로 보여줌
견적계획 -  Line	Payment Terms	N	CM_CODE_MST-PAYMENT_TERMS	공통코드에 등록되어 있음 화면에 List로 보여줌
견적계획 -  Line	Market	N	CM_CODE_MST-(DP_MD_MARKET_TYPE[10],DP_VI_MARKET_CODE[3])?	공통코드에 등록되어 있음 화면에 List로 보여줌
*/
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 
-- *, children.*
TENANT_ID,GROUP_CODE,children.CODE,children.CODE_DESCRIPTION,CHAIN_CODE,GROUP_NAME,GROUP_DESCRIPTION,MAXIMUM_COLUMN_SIZE
FROM cm_Code_Mst cd WHERE 1=1 
AND ( 1=0 
    OR upper(cd.group_code) like upper('%Incoterms%')
    OR upper(cd.group_code) like upper('%Payment%Terms%')
    OR upper(cd.group_code) like upper('%Market%')
)
;
-- @block Bookmarked query
-- @group SP_SC
-- @name  cm_Code_Dtl=+cm_Code_Lng - 공통코드
SELECT  cd.tenant_id ,
		cd.group_code,
	    cd.code      ,
	    cd.sort_no   ,
	    -- cd.sort_no   ,
	    children.code_name 
FROM cm_Code_Dtl AS cd LEFT OUTER JOIN cm_Code_Lng AS children
	ON (( children.tenant_id = cd.tenant_id 
	      AND children.group_code = cd.group_code
		  AND children.code = cd.code)
	    AND ( children.language_cd = UPPER(SUBSTRING( SESSION_CONTEXT('LOCALE'), 1, 2 )) ))
WHERE 1=1
AND ( 1=0 
    OR upper(cd.group_code) like upper('%Incoterms%')
    OR upper(cd.group_code) like upper('%Payment%Terms%')
    OR upper(cd.group_code) like upper('%Market%')
)
ORDER BY tenant_id ASC, group_code ASC, sort_no ASC
;

-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM cm_Code_Dtl cd WHERE 1=1 
AND ( 1=0 
    OR upper(cd.group_code) like upper('%Incoterms%')
    OR upper(cd.group_code) like upper('%Payment%Terms%')
    OR upper(cd.group_code) like upper('%Market%')
)
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM cm_Code_Mst cd WHERE 1=1 
AND ( 1=0 
    OR upper(cd.group_code) like upper('%Incoterms%')
    OR upper(cd.group_code) like upper('%Payment%Terms%')
    OR upper(cd.group_code) like upper('%Market%')
)
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
SELECT TOP 50 * FROM cm_Code_Mst WHERE 1=1 
AND ( 1=0 
    -- OR upper(group_code) like upper('%Incoterms%')
    -- OR upper(group_code) like upper('%Payment%Terms%')
    -- OR upper(group_code) like upper('%Market%')
    -- OR upper(group_code) like upper('%Award%')
    -- OR upper(group_code) like upper('%Nego%')
    OR upper(group_code) like upper('%DP_VI_MARKET_CODE%')
    OR upper(group_code) like upper('%PAYMENT_TERMS%')
    OR upper(group_code) like upper('%OP_INCOTERMS%')
    OR upper(group_code) like upper('%SP_SC_AWARD_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_NEGO_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_TYPE_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_METHOD_CODE%')
)
;

-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 500 
  TENANT_ID
, GROUP_CODE
, CHAIN_CODE
, GROUP_NAME
, GROUP_DESCRIPTION
, MAXIMUM_COLUMN_SIZE
-- , USE_FLAG
-- , LOCAL_CREATE_DTM
-- , LOCAL_UPDATE_DTM
-- , CREATE_USER_ID
-- , UPDATE_USER_ID
-- , SYSTEM_CREATE_DTM
-- , SYSTEM_UPDATE_DTM
-- , children.TENANT_ID
-- , children.GROUP_CODE
, children.CODE
, children.CODE_DESCRIPTION
, children.SORT_NO
-- , children.START_DATE
-- , children.END_DATE
-- , children.PARENT_GROUP_CODE
-- , children.PARENT_CODE
-- , children.REMARK
-- , children.COLOR_TYPE_CODE
-- , children.LOCAL_CREATE_DTM
-- , children.LOCAL_UPDATE_DTM
-- , children.CREATE_USER_ID
-- , children.UPDATE_USER_ID
-- , children.SYSTEM_CREATE_DTM
-- , children.SYSTEM_UPDATE_DTM
-- , children.children.TENANT_ID
-- , children.children.GROUP_CODE
-- , children.children.CODE
, children.children[LANGUAGE_CD='KO'].LANGUAGE_CD
, children.children[LANGUAGE_CD='KO'].CODE_NAME
-- , children.children.LOCAL_CREATE_DTM
-- , children.children.LOCAL_UPDATE_DTM
-- , children.children.CREATE_USER_ID
-- , children.children.UPDATE_USER_ID
-- , children.children.SYSTEM_CREATE_DTM
-- , children.children.SYSTEM_UPDATE_DTM
FROM cm_Code_Mst WHERE 1=1 
AND ( 1=0 
    -- OR upper(group_code) like upper('%Incoterms%')
    -- OR upper(group_code) like upper('%Payment%Terms%')
    -- OR upper(group_code) like upper('%Market%')
    -- OR upper(group_code) like upper('%Award%')
    -- OR upper(group_code) like upper('%Nego%')
    -- OR upper(group_code) like upper('%DP_VI_MARKET_CODE%')
    -- OR upper(group_code) like upper('%PAYMENT_TERMS%')
    -- OR upper(group_code) like upper('%OP_INCOTERMS%')
    OR upper(group_code) like upper('%SP_SC_AWARD_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_NEGO_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_TYPE_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_METHOD_CODE%')
);

/**********************************************************************************************************/
--** dd
/**********************************************************************************************************/
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM M_SQL_PLAN_CACHE WHERE 1=1 
-- AND FIELD = "VALUE"
;

-- @block Bookmarked query
-- @group Common
-- @name Contents to Csv | Sp_Sc_Negotiation_Style_Code
DO BEGIN
DECLARE OBJECT_NAME NVARCHAR(255) DEFAULT 'SP_SC_NEGOTIATION_STYLE_CODE';
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


