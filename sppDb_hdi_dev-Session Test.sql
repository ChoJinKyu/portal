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
-- @conn  sppDb_hdi_dev_RT-ko
-- #@conn  sppDb_hdi_dev_RT-en
-- #@conn  sppDb_hdi_dev_RT-zh
-- @group COMMON
-- @name  #How to use "Session Context"
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
