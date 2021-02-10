/** https://vscode-sqltools.mteixeira.dev/features/codelens */
-- @conn sppDb_hdi_dev_RT

/********************************************************************************************************/
-- SP_SC_NEGO_HEADERS - 백업
/********************************************************************************************************/
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT 'SP_SC_NEGO_HEADERS' as TABLE_NAME, count(*) cnt FROM SP_SC_NEGO_HEADERS NH WHERE 1=1 UNION ALL
SELECT 'SP_SC_NEGO_ITEM_PRICES' as TABLE_NAME, count(*) cnt FROM SP_SC_NEGO_ITEM_PRICES NI WHERE 1=1 UNION ALL
SELECT 'SP_SC_NEGO_SUPPLIERS' as TABLE_NAME, count(*) cnt FROM SP_SC_NEGO_SUPPLIERS NS WHERE 1=1 UNION ALL
SELECT 'NONE' as TABLE_NAME, count(*) cnt FROM SP_SC_NEGO_HEADERS NH WHERE 1=0
-- AND FIELD = "VALUE"
;

-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 5000 * 
FROM SP_SC_NEGO_HEADERS NH 
WHERE 1=1 
AND tenant_id = 'L2100'
AND nego_header_id = 4
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 5000 * 
FROM SP_SC_NEGO_ITEM_PRICES NH 
WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 5000 * 
FROM SP_SC_NEGO_SUPPLIERS NH 
WHERE 1=1 
-- AND FIELD = "VALUE"
;



/********************************************************************************************************/
-- AREA - TEST #1
/********************************************************************************************************/
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
-- UPDATE | TABLE SP_SC_NEGO_HEADERS | TO FIELD buyer_empno | FROM RANDOM SP_SC_EMPLOYEE_VIEW-EMPLOYEE_NUMBER
/********************************************************************************************************/

-- @block #Random Update#Cursor
-- @group SP_SC
-- @name TABLES - SP_SC_NEGO_HEADERS
--#Random Update#Cursor
do begin 
declare v_int integer = 1;
declare cursor c_tabcols FOR select * from SP_SC_NEGO_HEADERS 
where 1=1
-- AND ( 1=0
--     OR max_round_count is null             -- #UI:Max Round Count
--     OR auto_round is null                  -- #UI:Auto Round
--     OR auto_round_terms is null            -- #UI:Minute(Auto Round Terms)
--     OR previous_round is null              -- #UI:Previous Round
--     OR number_of_award_supplier is null    -- #UI:Number of Award Supplier
--     OR order_rate_01 is null               -- #UI:Order Rate
--     OR order_rate_02 is null               -- #UI:Order Rate
--     OR order_rate_03 is null               -- #UI:Order Rate
--     OR order_rate_04 is null               -- #UI:Order Rate
--     OR order_rate_05 is null               -- #UI:Order Rate
--     OR supplier_participation_flag is null -- #UI:Intention of Supplier Participation
--     OR partial_allow_flag is null          -- #UI:Partial Quotation
--     OR bid_conference is null              -- #UI:Bid Conference
--     OR bid_conference_date is null         -- #UI:Bid Conference Date
--     OR bid_conference_place is null        -- #UI:Bid Conference Place
--     OR contact_point_empno is null         -- #UI:Contact Point
--     OR phone_no is null                    -- #UI:Phone No
--     OR target_amount_config_flag is null   -- #UI:Target Price Setup 여부
--     OR target_amount is null               -- #UI:Target Total Amount 
-- )
;
 FOR c_tabcol as c_tabcols DO
--   update SP_SC_NEGO_HEADERS set max_round_count = map(floor(9*rand()+1),1,'2002',2,'2003',3,'2004',4,'2005',5,'2006',6,'2007',7,'2008',8,'2009',9,'260031','')
-- # max_round_count
--   update SP_SC_NEGO_HEADERS set max_round_count = floor(5*rand()+1)  --# 1..5
-- # auto_round
--   update SP_SC_NEGO_HEADERS set auto_round = map(floor(2*rand()+1), 1, true, 2, false, true) --# true or false
--   update SP_SC_NEGO_HEADERS set auto_round = map(floor(2*rand()+1), 1, 'X', 2, '', 'X') --# true 'X' or false ''
-- # auto_round_terms
--   update SP_SC_NEGO_HEADERS set auto_round_terms = floor(20*rand()+1)  --# 1..20
--   update SP_SC_NEGO_HEADERS set auto_round_terms = null  --# if auto_round = '' then null;
-- # previous_round
--   update SP_SC_NEGO_HEADERS set previous_round = map(floor(2*rand()+1), 1, 'X', 2, '', 'X') --# true 'X' or false ''
-- # number_of_award_supplier
--   update SP_SC_NEGO_HEADERS set number_of_award_supplier = null  --# 1..5 if Award Method = 'Multi Supplier' then 1..5
--   update SP_SC_NEGO_HEADERS set number_of_award_supplier = floor(5*rand()+1)  --# 1..5 if Award Method = 'Multi Supplier' then 1..5
--   update SP_SC_NEGO_HEADERS set order_rate_05 = NULL
--                               , order_rate_04 = NULL
--                               , order_rate_03 = NULL
--                               , order_rate_02 = NULL
--   update SP_SC_NEGO_HEADERS set order_rate_02 = floor(40*rand()+30)
                            --   , order_rate_03 = floor(30*rand()+20)
                            --   , order_rate_04 = floor(20*rand()+10)
                            --   , order_rate_05 = floor(10*rand()+1)
--   update SP_SC_NEGO_HEADERS set order_rate_01 = (100-ifnull(order_rate_02,0)-ifnull(order_rate_03,0)-ifnull(order_rate_04,0)-ifnull(order_rate_05,0))
-- # target_amount_config_flag
--   update SP_SC_NEGO_HEADERS set target_amount_config_flag = map(floor(2*rand()+1), 1, 'X', 2, '', 'X') --# true 'X' or false ''
-- # target_amount
--   update SP_SC_NEGO_HEADERS set target_amount = null
--   update SP_SC_NEGO_HEADERS set target_amount = floor(20*rand()+1)*100  --# 1..5

-- # supplier_participation_flag
--   update SP_SC_NEGO_HEADERS set supplier_participation_flag = map(floor(2*rand()+1), 1, 'X', 2, '', 'X') --# true 'X' or false ''
-- # partial_allow_flag
--   update SP_SC_NEGO_HEADERS set partial_allow_flag = map(floor(2*rand()+1), 1, 'X', 2, '', 'X') --# true 'X' or false ''
-- # bid_conference
--   update SP_SC_NEGO_HEADERS set bid_conference = map(floor(2*rand()+1), 1, 'X', 2, '', 'X') --# true 'X' or false ''
-- # bid_conference_date, bid_conference_place --# if bid_conference = 'X'
--   update SP_SC_NEGO_HEADERS set bid_conference_date = add_days(now(), floor(90*rand()+10))
--                               , bid_conference_place = map(floor(10*rand()+1),1,'Over Here',2,'Over There',3,'Here',4,'There',5,'Over Here',6,'Over Here',7,'Over Here',8,'Over Here',9,'Over Here','Over Here')
-- # contact_point_empno
  select count(*) into v_int from sp_Sc_Employee_View;
  update SP_SC_NEGO_HEADERS set contact_point_empno = (select max(employee_number) from (select row_number() over() rownum, employee_number from sp_Sc_Employee_View) where rownum = floor(:v_int*rand()+1)) --# true 'X' or false ''
-- # TBD
--   update SP_SC_NEGO_HEADERS set target_amount_config_flag = map(floor(2*rand()+1), 1, 'X', 2, '', 'X') --# true 'X' or false ''

-- # award_method_code
--   update SP_SC_NEGO_HEADERS set award_method_code = map(floor(2*rand()+1), 1, 'LPS', 2, 'MS', 'MS') --# true 'X' or false ''
--   update SP_SC_NEGO_HEADERS set award_method_code = 'LPS' --# if award_type_code eq "Award by Total Amount" then Only 'LPS'
where 1=1
and tenant_id = c_tabcol.tenant_id 
and nego_header_id = c_tabcol.nego_header_id 
and nego_type_code in ('CPB','TSB')  -- nego_type_code in ('RFQ','RFP')
and bid_conference = 'X'
-- and award_type_code = '010' -- Award by Lines
-- and award_type_code = '020' -- Award by Total Amount
-- and target_amount_config_flag = 'X'
-- and award_method_code = 'LPS' -- 최저 가격 공급 업체
-- and award_method_code = 'MS' -- Multi Supplier
-- and number_of_award_supplier = 2
-- and auto_round = 'X'
-- and nego_item_number = c_tabcol.nego_item_number
;
end for; end;

-- @block #Random Update#Cursor
-- @group SP_SC
-- @name TABLES - SP_SC_NEGO_HEADERS
select distinct 
-- max_round_count, auto_round ,auto_round_terms
-- award_type_code
nego_type_code
-- count(*)
, award_type_code, award_method_code
-- , number_of_award_supplier, order_rate_01, order_rate_02, order_rate_03, order_rate_04, order_rate_05
-- , target_amount_config_flag, target_amount
, bid_conference, bid_conference_date, bid_conference_place, contact_point_empno, phone_no
from SP_SC_NEGO_HEADERS where 1=1
and nego_type_code in ('CPB','TSB') 
-- and ( 1=0
-- -- or max_round_count is null
-- -- or specification is null
-- -- or specification is null
-- -- or specification is null
-- )
-- GROUP BY nego_type_code, award_type_code, award_method_code, number_of_award_supplier
-- , order_rate_01, order_rate_02, order_rate_03, order_rate_04, order_rate_05
;

-- @block #Random Update#Cursor
-- @group SP_SC
-- @name TABLES - SP_SC_NEGO_HEADERS
select * from (select row_number() over() rownum, employee_number from sp_Sc_Employee_View) where rownum = floor(10*rand()+1)
-- @select "$rowid$",* from SP_SC_NEGO_ITEM_PRICES;

/********************************************************************************************************/
-- UPDATE | TABLE SP_SC_NEGO_HEADERS | FIELD 
/********************************************************************************************************/
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
UPDATE SP_SC_NEGO_ITEM_PRICES set bidding_start_net_price_flag = NULL
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
-- DELETE FROM SP_SC_NEGO_ITEM_PRICES
-- -- AND FIELD = "VALUE"
-- ;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM SP_SC_NEGO_ITEM_PRICES WHERE 1=1 
-- AND FIELD = "VALUE"
;
-- @block Bookmarked query
-- @group SP_SC
-- @name TABLES - 설명
SELECT TOP 50 * FROM DUMMY WHERE 1=1 
-- AND FIELD = "VALUE"
;



-- @block Bookmarked query
-- @group Common
-- @name Contents to Csv
DO BEGIN
DECLARE OBJECT_NAME NVARCHAR(255) DEFAULT 'SP_SC_NEGO_ITEM_PRICES';
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


