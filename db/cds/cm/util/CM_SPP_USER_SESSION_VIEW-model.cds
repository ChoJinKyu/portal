namespace cm;

@cds.persistence.exists
entity Spp_User_Session_View{
  key CONNECTION : String;
  APPLICATIONUSER : String;
  USER_ID : String;
  TENANT_ID : String;
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
