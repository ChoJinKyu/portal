package lg.sppCap.solutionized.bizrule.rest;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

/**
 * application/x-www-form-urlencoded 유형으로 변환한다.
 */
public class GetParameter {

    public static String ENCODING = "UTF-8";

    /**
     * inData의 모든 값을 application/x-www-form-urlencoded 유형으로 변환한다. 변환된 값이 있는 경우 앞에 ?를 붙여 리턴한다.
     *
     * @param inData
     * @return
     */
    public static String getGetParamter(Map<String, Object> inData){
        String param = getURLEncodedString(inData);
        if (param.length() == 0) {
            return "";
        }
        return "?" + param;
    }

    /**
     * inData의 모든 값을 application/x-www-form-urlencoded 유형으로 변환한다.
     *
     * @param inData
     * @return
     */
    public static String getURLEncodedString(Map<String, Object> inData){
        if (inData == null || inData.isEmpty()) {
            return "";
        }
        StringBuilder result = new StringBuilder();
        boolean first = true;

        for (String key : inData.keySet()) {
            String value = String.valueOf(inData.get(key));
            if (first) {
                first = false;
            } else {
                result.append("&");
            }
            try {
                result.append(URLEncoder.encode(key, ENCODING));
                result.append("=");
                result.append(URLEncoder.encode(value, ENCODING));
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }

        return result.toString();
    }

}