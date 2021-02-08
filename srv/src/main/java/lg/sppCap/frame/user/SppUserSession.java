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

    public List<String> getSppUserAttributeList(String attrName) {
        return this.xsuaaUserInfo.getAttributeValues(attrName).isEmpty() ? null : this.xsuaaUserInfo.getAttributeValues(attrName);
    }

    public String getUserId() {
        return this.getSppUserAttribute(ATTR_USER_ID);
    }

    public String getEmail() {
        return this.getSppUserAttribute(ATTR_EMAIL);
    }

    /*
     * public String getName(){ return this.getSppUserAttribute(ATTR_USER_NAME); }
     */

    public String getLanguageCode() {
        return this.getSppUserAttribute(ATTR_LANGUAGE_CODE);
    }

    public String getCurrencyCode() {
        return this.getSppUserAttribute(ATTR_CURRENCY_CODE);
    }

    public String getTenantId() {
        return this.getSppUserAttribute(ATTR_TENANT_ID);
    }

    public String getCompanyCode() {
        return this.getSppUserAttribute(ATTR_COMPANY_CODE);
    }

    public String getEmployeeNumber() {
        return this.getSppUserAttribute(ATTR_EMPLOYEE_NUMBER);
    }

    public String getEmployeeName() {
        return this.getSppUserAttribute(ATTR_EMPLOYEE_NAME);
    }

    public String getEnglishEmployeeName() {
        return this.getSppUserAttribute(ATTR_ENGLISH_EMPLOYEE_NAME);
    }

    public String getEmployeeStatusCode() {
        return this.getSppUserAttribute(ATTR_EMPLOYEE_STATUS_CODE);
    }

    public String getTimezoneCode() {
        return this.getSppUserAttribute(ATTR_TIMEZONE_CODE);
    }

    public String getDateFormatType() {
        return this.getSppUserAttribute(ATTR_DATE_FORMAT_TYPE);
    }

    public String getDigisFormatType() {
        return this.getSppUserAttribute(ATTR_DIGITS_FORMAT_TYPE);
    }

    public String getRoles() {
        return this.getSppUserAttribute(ATTR_ROLES);
    }

    public List<String> getRolesList() {
        return Lists.newArrayList(this.xsuaaUserInfo.getRoles());
        //return this.getSppUserAttributeList(ATTR_ROLES);
    }

    public Boolean hasRole(String role) {
        return this.xsuaaUserInfo.hasRole(role);
        //return this.getRolesList().contains(role);
    }

    public Map<String, String> getUserSessionInfo(){
        return this.getXsuaaUserMap();
    }


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

