package lg.sppCap.solutionized.bizrule.calltype;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;
import lg.sppCap.solutionized.bizrule.reflect.IDoBizRule;
import lg.sppCap.solutionized.bizrule.reflect.SimpleReflection;

import java.util.Map;

/**
 * 현재 Binding 되어 있는 ClassPath로 부터 Class를 Instance화 하여 호출한다.
 * 호출 대상이 되는 Class는 {@link IDoBizRule}를 구현한 구현체여야 한다.
 *
 * {@link BizRuleInfo#getCallInfo()} 값에 package를 포함한 Class 명을 기준으로 인스턴스화 한다.
 */
public class LocalCallTypeInvoker implements ICallTypeInvoker {

    public Map<String, Object> executeCallType(BizRuleInfo info, Map<String, Object> inData){
        IDoBizRule bizRule = new SimpleReflection().createInstance(info.getCallInfo());
        return bizRule.executeBizRule(info, inData);
    }

}
