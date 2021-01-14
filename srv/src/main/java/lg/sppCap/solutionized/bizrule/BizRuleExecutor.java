package lg.sppCap.solutionized.bizrule;

import lg.sppCap.solutionized.bizrule.calltype.CallTypeInvokerFactory;
import lg.sppCap.solutionized.bizrule.calltype.ICallTypeInvoker;
import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 주어진 파라메터로 업무규칙을 호출한다.
 */
@Component
public class BizRuleExecutor {

    @Autowired
    BizRuleInfoService bizRuleInfoService;

    /**
     * tenantId+bizRuleId+altFlag 로 구성된 업무규칙을 호출한다.
     *
     * @param tenantId
     * @param bizRuleId
     * @param altFlag
     * @param inData
     * @return
     */
    public Map<String, Object> excuteBizRule(String tenantId, String bizRuleId, String altFlag, Map<String, Object> inData){
        BizRuleInfo info = getBizRuleInfo(tenantId, bizRuleId, altFlag);
        return excuteBizRule(info, inData);
    }

    /**
     * BizRuleInfo의 tenantId+bizRuleId+altFlag 로 구성된 업무규칙을 호출한다.
     *
     * @param info
     * @param inData
     * @return
     */
    public Map<String, Object> excuteBizRule(BizRuleInfo info, Map<String, Object> inData){
        ICallTypeInvoker handler = CallTypeInvokerFactory.getInstance().createCallTypeHandler(info);
        return handler.executeCallType(info, inData);
    }

    /**
     * tenantId+bizRuleId+altFlag 값으로 BizRuleInfo를 가져온다.
     * 필요시 Override하여 사용할 수도 있다.
     *
     * @param tenantId
     * @param bizRuleId
     * @param altFlag
     * @return
     */
    public BizRuleInfo getBizRuleInfo(String tenantId, String bizRuleId, String altFlag){
        return new BizRuleInfoService().retrieveBizRuleInfo(tenantId, bizRuleId, altFlag);
    }

}