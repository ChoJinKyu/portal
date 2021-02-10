package lg.sppCap.frame.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
//import java.util.Properties;

import com.google.common.collect.Lists;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 사용자 세션
 * @Chain  CM(공통)
 * @Author 조진규 (ckcho@lgcns.com)
 * @Date   2021.02.09
 */
@Component
public class SppUserSession {

    private static final String ATTR_ENTITY_KEY = "USER_ID";
    private static final String ATTR_USER_ID = "USER_ID";
//    private static final String ATTR_USER_NAME = "USER_NAME";
    private static final String ATTR_TENANT_ID = "TENANT_ID";
    private static final String ATTR_COMPANY_CODE = "COMPANY_CODE";
    private static final String ATTR_EMPLOYEE_NUMBER = "EMPLOYEE_NUMBER";
    private static final String ATTR_EMPLOYEE_NAME = "EMPLOYEE_NAME";
    private static final String ATTR_ENGLISH_EMPLOYEE_NAME = "ENGLISH_EMPLOYEE_NAME";
    private static final String ATTR_EMPLOYEE_STATUS_CODE = "EMPLOYEE_STATUS_CODE";
    private static final String ATTR_LANGUAGE_CODE = "LANGUAGE_CODE";
    private static final String ATTR_TIMEZONE_CODE = "TIMEZONE_CODE";
    private static final String ATTR_DATE_FORMAT_TYPE = "DATE_FORMAT_TYPE";
    private static final String ATTR_DIGITS_FORMAT_TYPE = "DIGITS_FORMAT_TYPE";
    private static final String ATTR_CURRENCY_CODE = "CURRENCY_CODE";
    private static final String ATTR_EMAIL = "EMAIL";
    private static final String ATTR_ROLES = "ROLES";

    @Autowired
    private XsuaaUserInfo xsuaaUserInfo;

    @Autowired
    private JdbcTemplate jdbc;

    /**
     * Transaction 시작 시점에 사용자정보를 DB에서 사용할 수 있도록 Setting
     */
    public void setDbSessionContext(){
        //String sessUserSql = "SELECT  SESSION_CONTEXT('USER_ID') FROM DUMMY";
        //String sessUserId = jdbc.queryForObject(sessUserSql, String.class);

        //if (sessUserId == null || !"".equals(sessUserId)) {
            Map<String, String> userSeesionMap = this.getUserSessionInfo();
            String setStatement = "";
            for (String key : userSeesionMap.keySet()) {
                setStatement = "SET '" + key + "' = '" + userSeesionMap.get(key) + "';";
                jdbc.execute(setStatement);
            }
        //}
    }

    /**
     * Transaction 종료 시점에 사용자정보를 DB Setting한 사용자 정보를 삭제
     */
    public void unSetDbSessionContext(){
        //String sessUserSql = "SELECT  SESSION_CONTEXT('USER_ID') FROM DUMMY";
        //String sessUserId = jdbc.queryForObject(sessUserSql, String.class);

        //if (sessUserId == null || !"".equals(sessUserId)) {
            Map<String, String> userSeesionMap = this.getUserSessionInfo();
            String setStatement = "";
            for (String key : userSeesionMap.keySet()) {
                setStatement = "UNSET '" + key + "'";
                jdbc.execute(setStatement);
            }
        //}
    }

    // public Properties getDbSessionContextProperties(Boolean p_setFlag){
    //     Properties properties = new Properties();
    //     if(p_setFlag){
    //         properties.putAll(this.getXsuaaUserMap());
    //     }else{
    //         Map<String, String> map = this.getXsuaaUserMap();
    //         for(String key : map.keySet()){
    //             map.replace(key, null);
    //         }
    //         properties.putAll(map);
    //     }

    //     return properties;
    // }

    /**
     * XsuaaUserInfo 에서 사용자 정보를 추출
     * @param attrName : String 사용자 정보 속성 명
     * @return String 사용자 속성 값
     */
    public String getSppUserAttribute(String attrName) {
        if(this.xsuaaUserInfo.getAttributeValues(attrName) == null || this.xsuaaUserInfo.getAttributeValues(attrName).isEmpty()){
            return "";
        }else{
            
            if(ATTR_ROLES.equals(attrName)){
                return this.xsuaaUserInfo.getRoles().toString();
            }else{
                
                if(this.xsuaaUserInfo.getAttributeValues(attrName).size() > 1){
                    return this.xsuaaUserInfo.getAttributeValues(attrName).toString();
                }else{ 
                    return this.xsuaaUserInfo.getAttributeValues(attrName).get(0).toString();
                }
            }
            
        }
    }

    /**
     * XsuaaUserInfo 에서 사용자 정보를 추출
     * @param attrName : String 사용자 정보 속성 명
     * @return List<String> 사용자 속성 값 List
     */
    public List<String> getSppUserAttributeList(String attrName) {
        return this.xsuaaUserInfo.getAttributeValues(attrName).isEmpty() ? null : this.xsuaaUserInfo.getAttributeValues(attrName);
    }

    /**
     * XsuaaUserInfo 에서 사용자 아이디 반환
     * @return String User ID
     */
    public String getUserId() {
        return this.getSppUserAttribute(ATTR_USER_ID);
    }

    /**
     * XsuaaUserInfo 에서 사용자 이메일 반환
     * @return String User Email
     */
    public String getEmail() {
        return this.getSppUserAttribute(ATTR_EMAIL);
    }

    /*
     * public String getName(){ return this.getSppUserAttribute(ATTR_USER_NAME); }
     */

    /**
     * XsuaaUserInfo 에서 사용자 언어코드 반환
     * @return String User Language Code
     */
    public String getLanguageCode() {
        return this.getSppUserAttribute(ATTR_LANGUAGE_CODE);
    }

    /**
     * XsuaaUserInfo 에서 사용자 통화코드 반환
     * @return String User Currency Code
     */
    public String getCurrencyCode() {
        return this.getSppUserAttribute(ATTR_CURRENCY_CODE);
    }

    /**
     * XsuaaUserInfo 에서 사용자 Tenant Id 반환
     * @return String User Tenant Id
     */
    public String getTenantId() {
        return this.getSppUserAttribute(ATTR_TENANT_ID);
    }

    /**
     * XsuaaUserInfo 에서 사용자 회사코드 반환
     * @return String User Company Code 
     */
    public String getCompanyCode() {
        return this.getSppUserAttribute(ATTR_COMPANY_CODE);
    }

    /**
     * XsuaaUserInfo 에서 사용자 사번 반환
     * @return String User Employee Number
     */
    public String getEmployeeNumber() {
        return this.getSppUserAttribute(ATTR_EMPLOYEE_NUMBER);
    }

    /**
     * XsuaaUserInfo 에서 사용자 이름 반환
     * @return String User Employee Name
     */
    public String getEmployeeName() {
        return this.getSppUserAttribute(ATTR_EMPLOYEE_NAME);
    }

    /**
     * XsuaaUserInfo 에서 사용자 영문이름 반환
     * @return String User English Employee Name
     */
    public String getEnglishEmployeeName() {
        return this.getSppUserAttribute(ATTR_ENGLISH_EMPLOYEE_NAME);
    }

    /**
     * XsuaaUserInfo 에서 사용자 상태코드 반환
     * @return String User Employee Status Code
     */
    public String getEmployeeStatusCode() {
        return this.getSppUserAttribute(ATTR_EMPLOYEE_STATUS_CODE);
    }

    /**
     * XsuaaUserInfo 에서 사용자 타임존코드 반환
     * @return String User Timezone Code
     */
    public String getTimezoneCode() {
        return this.getSppUserAttribute(ATTR_TIMEZONE_CODE);
    }

    /**
     * XsuaaUserInfo 에서 사용자 날짜포멧 반환
     * @return String User Date Format Type
     */
    public String getDateFormatType() {
        return this.getSppUserAttribute(ATTR_DATE_FORMAT_TYPE);
    }

    /**
     * XsuaaUserInfo 에서 사용자 숫자 반환
     * @return String User Digis Format Type
     */
    public String getDigisFormatType() {
        return this.getSppUserAttribute(ATTR_DIGITS_FORMAT_TYPE);
    }

    /**
     * XsuaaUserInfo 에서 사용자 Role 반환
     * @return String User Role
     */
    public String getRoles() {
        return this.getSppUserAttribute(ATTR_ROLES);
    }

    /**
     * XsuaaUserInfo 에서 사용자 Role 반환
     * @return List<String> User Role List
     */
    public List<String> getRolesList() {
        return Lists.newArrayList(this.xsuaaUserInfo.getRoles());
        //return this.getSppUserAttributeList(ATTR_ROLES);
    }

    /**
     * XsuaaUserInfo param에 해당하는 role이 있는지 boolean으로 반환
     * @param role String Role 코드
     * @return Boolean 사용자에게 role이 있는지 여부 반환
     */
    public Boolean hasRole(String role) {
        return this.xsuaaUserInfo.hasRole(role);
        //return this.getRolesList().contains(role);
    }

    /**
     * XsuaaUserInfo 에서 사용자 정보 Map으로 반환
     * @return Map<String, String> User Info
     */
    public Map<String, String> getUserSessionInfo(){
        return this.getXsuaaUserMap();
    }


    /**
     * XsuaaUserInfo 에서 사용자 정보 Map으로 반환
     * @return Map<String, String> User Info
     */
    private Map<String, String> getXsuaaUserMap() {
        Map<String, String> userInfo = new HashMap<String, String>();
        Map<String, List<String>> xsUserInfo = this.xsuaaUserInfo.getAttributes();
        for ( String key : xsUserInfo.keySet() ) {
            userInfo.put(key, this.getSppUserAttribute(key));
            /*
            if(xsUserInfo.get(key).isEmpty()){
                userInfo.put(key, "");
            }else if(xsUserInfo.get(key).size() > 1){
                userInfo.put(key, xsUserInfo.get(key).toString());
            }else{ 
                userInfo.put(key, xsUserInfo.get(key).get(0));
            }
            */
        }

        if(userInfo.get(ATTR_ENTITY_KEY) == null || userInfo.get(ATTR_ENTITY_KEY).isEmpty()){
            userInfo.put(ATTR_ENTITY_KEY, this.xsuaaUserInfo.getName());
        }

        return userInfo;
    }

}

