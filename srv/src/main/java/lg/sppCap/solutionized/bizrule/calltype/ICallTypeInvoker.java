package lg.sppCap.solutionized.bizrule.calltype;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

import java.util.Map;

public interface ICallTypeInvoker {
    public Map<String, Object> executeCallType(BizRuleInfo info, Map<String, Object> inData);
}
