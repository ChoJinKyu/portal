namespace pg;

@cds.persistence.exists
entity Vp_Vendor_Pool_Temp_Session_View{
  key TENANT_ID : String;
  APPLICATIONUSER : String;
  USER_ID : String;
  CONNECTION : String;
  COMPANY_CODE : String;
  EMPLOYEE_NUMBER : String;
  EMPLOYEE_NAME : String;
  ENGLISH_EMPLOYEE_NAME : String;
  EMPLOYEE_STATUS_CODE : String;
  LANGUAGE_CODE : String;
  TIMEZONE_CODE : String;
  DATE_FORMAT_TYPE : String;
  DIGITS_FORMAT_TYPE : String;
  CURRENCY_CODE : String;
  EMAIL : String;
  ROLES : String;
}
