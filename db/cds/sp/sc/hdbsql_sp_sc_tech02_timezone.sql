/** https://vscode-sqltools.mteixeira.dev/features/codelens */
-- @conn sppDb_hdi_dev_RT

-- @block Bookmarked query
-- @group SP_SC
-- @name #Platform#SAPHelp:TO_TIME Function (Data Type Conversion)
SELECT * FROM TIMEZONES
;
-- @block Bookmarked query
-- @group SP_SC
-- @name #Platform#SAPHelp:TO_TIME Function (Data Type Conversion)
--#UTC+9#Asia/Seoul#UTC-9#US/Alaska
SELECT NOW AS NOW_IS_LOCALTIME
--, (NOW + 0) AD NOW_NUM
, TO_NVARCHAR(NOW, 'YYYYMMDDHH24MISS') AS YYYYMMDDHH24MISS_NOW
, CURRENT_TIMESTAMP
, CURRENT_UTCTIMESTAMP
--, TO_NVARCHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISSFF3') AS YYYYMMDDHH24MISS
, LOCALTOUTC(NOW,'Asia/Seoul','platform') AS LOCALTOUTC_UTC9
, UTCTOLOCAL(LOCALTOUTC(NOW,'Asia/Seoul','platform'),'Asia/Seoul','platform') AS UTCTOLOCALLOCALTOUTC_UTC9
, LOCALTOUTC(NOW,'US/Alaska','platform') AS LOCALTOUTC_UTC_9
, TO_NVARCHAR(CURRENT_TIMESTAMP, 'HH24:MI:SS.FF3') AS HH24MISS
, TO_NVARCHAR(CURRENT_TIMESTAMP, 'HH24:MI:SS') AS HH24MISS
, TO_NVARCHAR(NOW,'YYYYMMDD') AS TODAY 
, TO_NCHAR(NOW, 'YYYYMMDDHH24MISS') AS "YYYYMMDDHH24MISS"
, TO_NVARCHAR(NOW, 'YYYYMMDDHH24MISS') AS "YYYYMMDDHH24MISS"
, TO_NVARCHAR(UTCTOLOCAL(NOW,'Asia/Seoul','platform'), 'YYYYMMDDHH24MISS') AS YYYYMMDDHH24MISS_UTCTOLOCAL_UTC9
, TO_NVARCHAR(LOCALTOUTC(NOW,'Asia/Seoul','platform'), 'YYYYMMDDHH24MISS') AS YYYYMMDDHH24MISS_LOCALTOUTC_UTC9
, TO_NVARCHAR(UTCTOLOCAL(NOW,'US/Alaska','platform'), 'YYYYMMDDHH24MISS') AS YYYYMMDDHH24MISS_UTCTOLOCAL_UTC_9
, TO_NVARCHAR(LOCALTOUTC(NOW,'US/Alaska','platform'), 'YYYYMMDDHH24MISS') AS YYYYMMDDHH24MISS_LOCALTOUTC_UTC_9
	FROM (SELECT NOW() AS NOW FROM DUMMY)
;

-- @block Bookmarked query
-- @group SP_SC
-- @name #SessionContext
-- @table M_SESSION_CONTEXT
select CURRENT_UTCTIMESTAMP,CURRENT_TIMESTAMP,* from m_session_context where connection_id = current_connection;

-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 *, texts.* FROM SAP_COMMON_CURRENCIES WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM CM_APPROVAL_MST WHERE 1=1 
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