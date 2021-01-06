package lg.sppCap.solutionized.bizrule.rest;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 주어진 문자열 중에 {key}로 표현되고 key값이 inData에 있는 경우 해당 값을 치환하는 기능을 제공한다.
 */
public class PathVariable {

    private static final Pattern pattern = Pattern.compile("\\{(.*?)\\}");

    /**
     * url의 path 중 일부가 {key}로 표현되고 key값이 inData에 있는 경우 해당 값을 치환한다.
     * inData에 key가 없거나 null인 경우는 치환하지 않는다.
     *
     * @param url
     * @param inData
     * @return
     */

    public static String convert(String url, Map<String, Object> inData){
        if (inData == null || inData.isEmpty()) {
            return url;
        }
        StringBuffer sb = new StringBuffer();
        Matcher matcher = pattern.matcher(url);
        int last = 0;
        while (matcher.find()) {
            String sub = url.substring(last, matcher.start());
            String key = matcher.group(1);
            Object object = inData.get(key);
            if (object != null) {
                String replacement = String.valueOf(object);
                sb.append(sub).append(replacement);
            } else {
                sb.append(sub).append(matcher.group(0));
            }
            last = matcher.end();
        }
        sb.append(url.substring(last));
        return sb.toString();
    }

}
