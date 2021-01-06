package lg.sppCap.solutionized.bizrule;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Autowired;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

public class BizRuleInfoService {
 
  @Autowired
  private PersistenceService db;

  public BizRuleInfo retrieveBizRuleInfo(String tenantId, String bizRuleId, String altFlag){
      BizRuleInfo info = new BizRuleInfo();
      info.setTenantId(tenantId);
      info.setBizRuleId(bizRuleId);
      info.setAltFlag(altFlag);

      CqnSelect infoSelect = Select
        .from("tmp.bizrule_info")
        .columns("TENANT_ID","BIZRULE_ID","ALT_FLG","CALL_TYPE","CALL_HOST","CALL_INFO")
        .where(
          b->b.get("TENANT_ID").eq(info.getTenantId())
          .and(b.get("BIZRULE_ID").eq(info.getBizRuleId()))
          .and(b.get("ALT_FLAG").eq(info.getAltFlag()))
        );

      Result result = db.run(infoSelect);
      info.setTenantId((String)result.first().get().get("TENANT_ID"));
      info.setTenantId((String)result.first().get().get("BIZRULE_ID"));
      info.setTenantId((String)result.first().get().get("ALT_FLG"));
      info.setTenantId((String)result.first().get().get("CALL_TYPE"));
      info.setTenantId((String)result.first().get().get("CALL_HOST"));
      info.setTenantId((String)result.first().get().get("CALL_INFO"));
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
 
  }
}