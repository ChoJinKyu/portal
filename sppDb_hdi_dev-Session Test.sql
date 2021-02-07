-- # Common Connection : Select a menu "Attach Connection From File" when the right mouse button

-- @block Bookmarked query
-- @group COMMON
-- @name  #
select session_context('LOCALE') from dummy
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT-en
-- @group COMMON
-- @name  #Session Context
select session_context('LOCALE') from dummy
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT-ko
-- @group COMMON
-- @name  #Session Context
SELECT KEY, VALUE FROM M_SESSION_CONTEXT
WHERE CONNECTION_ID = CURRENT_CONNECTION
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT
-- @group COMMON
-- @name  #Test Localized Text - Master Table
SELECT 
  "ID"
, "TITLE"
, "DESCR"
, "STOCK"
, "PRICE"
, "CURRENCY_CODE"
, "CATEGORY_ID"
, "CREATEDAT"
, "CREATEDBY"
, "MODIFIEDAT"
, "MODIFIEDBY"
FROM xx_Products WHERE 1=1
-- AND FIELD = ''
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT
-- @group COMMON
-- @name  #Test Localized Text - Generated Association Text Table
SELECT "LOCALE", "ID", "TITLE", "DESCR" FROM xx_Products_texts WHERE 1=1
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT
-- @group COMMON
-- @name  #Test Localized Text - Upsert Test Data - Master Table
UPSERT xx_Products ("ID","TITLE","DESCR","STOCK","PRICE","CURRENCY_CODE","CATEGORY_ID","CREATEDAT","CREATEDBY","MODIFIEDAT","MODIFIEDBY")
SELECT 'DBD516F00EF8407517000216731169D7' AS "ID" --SYSUUID   AS "ID"
, 'SAMPLE_TITLE' AS "TITLE"
, 'SAMPLE_DESCR' AS "DESCR"
, 1              AS "STOCK"
, 9.2            AS "PRICE"
, 'USD'          AS "CURRENCY_CODE"
, 101            AS "CATEGORY_ID"
, NOW()          AS "CREATEDAT"
, CURRENT_USER   AS "CREATEDBY"
, NOW()          AS "MODIFIEDAT"
, CURRENT_USER   AS "MODIFIEDBY" 
FROM DUMMY WHERE 1=1
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT
-- @group COMMON
-- @name  #Test Localized Text - Upsert Test Data - Master Table
-- @capref https://cap.cloud.sap/docs/guides/i18n#normalized-locales
UPSERT xx_Products_texts ("LOCALE", "ID", "TITLE", "DESCR")
SELECT * FROM (
SELECT 'en', '90E216F00EF8407517000216731169D7', 'SAMPLE_TITLE', 'SAMPLE_DESCRIPTION' FROM DUMMY UNION ALL 
SELECT 'ko', '90E216F00EF8407517000216731169D7', '샘플_제목', '샘플_설명' FROM DUMMY UNION ALL 
SELECT 'zh_CN', '90E216F00EF8407517000216731169D7', '样本_标题', '样本_描述' FROM DUMMY UNION ALL 
SELECT 'en', '90E216F00EF8407517000216731169D7', 'SAMPLE_TITLE', 'SAMPLE_DESCR' FROM DUMMY WHERE 1=0
)
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT-ko
-- @group COMMON
-- @name  #Test Localized Text - How to use CDS Localized Text - Association One to Zero "LOCALIZED" - ko
-- @capref https://cap.cloud.sap/docs/guides/i18n#normalized-locales
SELECT session_context('LOCALE') LOCALE,"ID","TITLE","DESCR"
,localized."TITLE",localized."DESCR"
,"STOCK","PRICE","CURRENCY_CODE","CATEGORY_ID","CREATEDAT","CREATEDBY","MODIFIEDAT","MODIFIEDBY" 
FROM xx_Products WHERE 1=1
;

-- @block Bookmarked query
-- @#conn  sppDb_hdi_dev_RT
-- @conn  sppDb_hdi_dev_RT-en
-- @#conn  sppDb_hdi_dev_RT-ko
-- @#conn  sppDb_hdi_dev_RT-zh_CN
-- @group COMMON
-- @name  #Test Localized Text - How to use CDS Localized Text - Association One to Zero "LOCALIZED" - en
-- @capref https://cap.cloud.sap/docs/guides/i18n#normalized-locales
SELECT session_context('LOCALE') LOCALE,"ID","TITLE","DESCR"
,localized."TITLE",localized."DESCR"
,"STOCK","PRICE","CURRENCY_CODE","CATEGORY_ID","CREATEDAT","CREATEDBY","MODIFIEDAT","MODIFIEDBY" 
FROM xx_Products WHERE 1=1
;

-- @block Bookmarked query
-- @#conn  sppDb_hdi_dev_RT
-- @conn  sppDb_hdi_dev_RT-en
-- @#conn  sppDb_hdi_dev_RT-ko
-- @#conn  sppDb_hdi_dev_RT-zh_CN
-- @group COMMON
-- @name  #Test Localized Text - How to use CDS Localized Text - Association One to Many "TEXTS" - en
-- @capref https://cap.cloud.sap/docs/guides/i18n#normalized-locales
SELECT session_context('LOCALE') LOCALE,"ID","TITLE","DESCR"
,texts."TITLE",texts."DESCR"
,"STOCK","PRICE","CURRENCY_CODE","CATEGORY_ID","CREATEDAT","CREATEDBY","MODIFIEDAT","MODIFIEDBY" 
FROM xx_Products WHERE 1=1
;

-- @block Bookmarked query
-- @#conn  sppDb_hdi_dev_RT
-- @conn  sppDb_hdi_dev_RT-en
-- @#conn  sppDb_hdi_dev_RT-ko
-- @#conn  sppDb_hdi_dev_RT-zh_CN
-- @group COMMON
-- @name  #Test Localized Text - How to use CDS Localized Text - Generated Localized View - en
-- @capref https://cap.cloud.sap/docs/guides/i18n#normalized-locales
SELECT session_context('LOCALE') LOCALE,"ID","TITLE","DESCR"
-- ,texts."TITLE",texts."DESCR"
,"STOCK","PRICE","CURRENCY_CODE","CATEGORY_ID","CREATEDAT","CREATEDBY","MODIFIEDAT","MODIFIEDBY" 
FROM LOCALIZED_xx_Products WHERE 1=1
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT-ko
-- #@conn  sppDb_hdi_dev_RT-en
-- #@conn  sppDb_hdi_dev_RT-zh_CN
-- @group COMMON
-- @name  #How to use "Session Context" and "HANA Association"
SELECT TOP 500 
  session_context('LOCALE') LOCALE
, TENANT_ID
, GROUP_CODE
, CHAIN_CODE
, GROUP_NAME
, GROUP_DESCRIPTION
, MAXIMUM_COLUMN_SIZE
, children.CODE
, children.CODE_DESCRIPTION
, children.SORT_NO
-- , children.children[LANGUAGE_CD=upper(session_context('LOCALE'))].LANGUAGE_CD  -- Cannot use an expression in native hana sql, but can use in cds view
-- , children.children[LANGUAGE_CD=upper(session_context('LOCALE'))].CODE_NAME    -- Cannot use an expression in native hana sql, but can use in cds view
, children.children.LANGUAGE_CD
, children.children.CODE_NAME
FROM cm_Code_Mst WHERE 1=1 
AND lower(children.children.LANGUAGE_CD) = substring(session_context('LOCALE'),1,2)
AND ( 1=0 
    OR upper(group_code) like upper('%SP_SC_AWARD_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_NEGO_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_TYPE_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_METHOD_CODE%')
)
;

-- @block Bookmarked query
-- @conn  sppDb_hdi_dev_RT-ko
-- @group COMMON
-- @name  #How to use Inline Sql with "Association Relationship"
SELECT TOP 500 
  TENANT_ID
, GROUP_CODE
, CHAIN_CODE
, GROUP_NAME
, GROUP_DESCRIPTION
, MAXIMUM_COLUMN_SIZE
, children.CODE
, children.CODE_DESCRIPTION
, children.SORT_NO
, children.children[LANGUAGE_CD='KO'].LANGUAGE_CD
, children.children[LANGUAGE_CD='KO'].CODE_NAME
FROM cm_Code_Mst WHERE 1=1 
AND ( 1=0 
    OR upper(group_code) like upper('%SP_SC_AWARD_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_NEGO_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_TYPE_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_METHOD_CODE%')
);
