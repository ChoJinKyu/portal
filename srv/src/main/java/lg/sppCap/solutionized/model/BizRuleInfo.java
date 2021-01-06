package lg.sppCap.solutionized.model;

public class BizRuleInfo {
 
  private String tenantId; //업무규칙이 적용될 tenant의 ID
 
  private String bizRuleId; //업무규칙의 Iㅇ
 
  private String altFlag; //업무규칙이 경우에 따라 실행되어야 할 경우 분기할 수 있는 값
 
  private String callType; //이미 지정된 호출 방식
 
  private String callHost; //업무 규칙 모듈의 Location 정보
 
  private String callInfo; //업무 규칙의 호출에 필요한 값
 
  /**
   * 기본 생성자
   */
  public BizRuleInfo() {
 
  }
 
  /**
   * 업무규칙을 특정할 수 있는 속성을 제공하는 생성자
   */
  public BizRuleInfo(String tenantId, String bizRuleId, String altFlag) {
    this.tenantId = tenantId;
    this.bizRuleId = bizRuleId;
    this.altFlag = altFlag;
  }
 
  public String getTenantId(){
    return tenantId;
  }
 
  public void setTenantId(String tenantId){
    this.tenantId = tenantId;
  }
 
  public String getBizRuleId(){
    return bizRuleId;
  }
 
  public void setBizRuleId(String bizRuleId){
    this.bizRuleId = bizRuleId;
  }
 
  public String getAltFlag(){
    return altFlag;
  }
 
  public void setAltFlag(String altFlag){
    this.altFlag = altFlag;
  }
 
  public String getCallType(){
    return callType;
  }
 
  public void setCallType(String callType){
    this.callType = callType;
  }
 
  public String getCallInfo(){
    return callInfo;
  }
 
  public void setCallInfo(String callInfo){
    this.callInfo = callInfo;
  }
 
  public String getCallHost(){
    return callHost;
  }
 
  public void setCallHost(String callHost){
    this.callHost = callHost;
  }
 
}