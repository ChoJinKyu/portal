package lg.sppCap.solutionized.bizrule;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

public class BizRuleInfoService {
 
  public BizRuleInfo retrieveBizRuleInfo(String tenantId, String bizRuleId, String altFlag){
 
    try {

      BizRuleInfo info = new BizRuleInfo();
      info.setTenantId(tenantId);
      info.setBizRuleId(bizRuleId);
      info.setAltFlag(altFlag);

      /*
      Connection conn = DataSourceConnection.getInstance().getConnection();
 
      PreparedStatement stmt = conn.prepareStatement("SELECT TENANT_ID, BIZRULE_ID, ALT_FLG, CALL_TYPE, CALL_HOST, CALL_INFO FROM BIZRULE_INFO where TENANT_ID=? and BIZRULE_ID=? and ALT_FLG=?");
      stmt.setString(1, info.getTenantId());
      stmt.setString(2, info.getBizRuleId());
      stmt.setString(3, info.getAltFlag());
 
      ResultSet rs = stmt.executeQuery("select user_id, user_nm from internal_user");
 
      while (rs.next()) {
        info.setTenantId(rs.getString(1));
        info.setBizRuleId(rs.getString(2));
        info.setAltFlag(rs.getString(3));
        info.setCallType(rs.getString(4));
        info.setCallHost(rs.getString(5));
        info.setCallInfo(rs.getString(6));
      }
      */
      return info;
    } catch (Exception e) {
      throw new RuntimeException("Error Occurred while retrieve BizRuleInfo from DB : " + tenantId + ", " + bizRuleId + ", " + altFlag, e);
    }
 
  }
}