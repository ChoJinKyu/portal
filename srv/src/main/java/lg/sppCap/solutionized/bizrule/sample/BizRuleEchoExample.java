package lg.sppCap.solutionized.bizrule.sample;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;
import lg.sppCap.solutionized.bizrule.reflect.IDoBizRule;

import java.util.HashMap;
import java.util.Map;

public class BizRuleEchoExample implements IDoBizRule {

    public Map<String, Object> executeBizRule(BizRuleInfo info, Map<String, Object> inData){
        Map<String, Object> outData = new HashMap<String, Object>();

        for (String key : inData.keySet()) {
            outData.put(key, "Echo " + inData.get(key));
        }

        return outData;
    }

}