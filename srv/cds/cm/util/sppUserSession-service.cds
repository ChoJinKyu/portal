namespace cm.util;

using cm.Spp_User_Session_View as Spp_User_Session_View from '../../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';

@path : '/cm.util.SppUserSessionService'
service SppUserSessionService {

    @cds.persistence.exists
    entity SppUserSession {
        key USER_ID : String;
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
    };

    @readonly
    entity SppUserSessionView as projection on Spp_User_Session_View;

}
