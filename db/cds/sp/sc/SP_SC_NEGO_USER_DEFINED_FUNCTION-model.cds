namespace sp;

@cds.persistence.exists
@cds.persistence.udf
entity Sc_My_Session() {
    key locale_lg  : String(2);
    key locale     : String(10);
    key locale_sap : String(1) ; 
    key tenant_id  : String(5) ; 
};

@cds.persistence.exists
entity Sc_Session_Local_Func(TENANT_ID: String(5)) {
    key locale_lg  : String(2);
};

/* 
FUNCTION SP_SC_MY_SESSION( )
RETURNS LOCALE_LG  NVARCHAR(2)
      , LOCALE     NVARCHAR(10)
      , LOCALE_SAP NVARCHAR(1)
      , TENANT_ID  NVARCHAR(5)
    LANGUAGE SQLSCRIPT
AS
-- DO
BEGIN 
	-- DECLARE LOCALE NVARCHAR(10);
	-- DECLARE LOCALE_SAP NVARCHAR(1);
	-- DECLARE TENANT_ID NVARCHAR(5);
    SELECT UPPER(SUBSTRING(SESSION_CONTEXT('LOCALE'),1,2)), SESSION_CONTEXT('LOCALE'), SESSION_CONTEXT('LOCALE_SAP'), 'L2100' TENANT_ID
      INTO LOCALE_LG, LOCALE, LOCALE_SAP, TENANT_ID FROM DUMMY; 
	-- SELECT :LOCALE, :LOCALE_SAP FROM DUMMY;
END ;
 */