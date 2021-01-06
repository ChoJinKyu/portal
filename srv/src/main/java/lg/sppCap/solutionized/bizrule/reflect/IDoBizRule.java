package lg.sppCap.solutionized.bizrule.reflect;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

import java.util.Map;

public interface IDoBizRule {
    /**
     * @param info 참고용을 전달되는 업무규칙 정의 정보
     * @param inData 처리에 필요한 input Data
     * @return 처리한 결과 output Data
     */
    public Map<String, Object> executeBizRule(BizRuleInfo info, Map<String, Object> inData);
}