package lg.sppCap.solutionized.bizrule.calltype;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;
import lg.sppCap.solutionized.bizrule.reflect.IDoBizRule;
import lg.sppCap.solutionized.bizrule.reflect.SimpleReflection;

import java.util.Map;

public class InjarCallTypeInvoker implements ICallTypeInvoker {

    public Map<String, Object> executeCallType(BizRuleInfo info, Map<String, Object> inData){
        IDoBizRule bizRule = new SimpleReflection().createInstance(info.getCallHost(), info.getCallInfo());
        return bizRule.executeBizRule(info, inData);
    }

}