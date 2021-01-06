package lg.sppCap.solutionized.bizrule.calltype;

import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;
import lg.sppCap.solutionized.bizrule.okhttp.OKHttpRestAPI;

import java.util.Map;

/**
 * Rest API를 Get 방식으로 호출한다.
 * inData는 "application/x-www-form-urlencoded" 유형으로 변환되어 Get Paramter로 전달된다. <br/>
 *
 * {@link BizRuleInfo#getCallInfo()} 값에 {key} 와 같은 형식의 문자열이 있고 inData의 key 값으로 동일한 값이 있는 경우 {key}는 inData의 key와 mapping되는 value값으로 치환될 것이다. <br/>
 * 예 ) https://jsonplaceholder.typicode.com/posts/{id} 인 경우 id 값이 1이라면 https://jsonplaceholder.typicode.com/posts/1 로 변환됨
 *
 */
public class RestDeleteCallTypeInvoker implements ICallTypeInvoker {

    public Map<String, Object> executeCallType(BizRuleInfo info, Map<String, Object> inData){
        Map<String, Object> outData = new OKHttpRestAPI().doDelete(info.getCallHost() + "/" + info.getCallInfo(), inData);
        return outData;
    }

}
