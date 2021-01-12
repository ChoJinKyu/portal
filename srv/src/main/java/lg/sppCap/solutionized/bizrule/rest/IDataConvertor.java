package lg.sppCap.solutionized.bizrule.rest;

import com.squareup.okhttp.MediaType;

import java.util.Map;

/**
 *
 * Rest API 사용시 Map<String, Object> 유형과 Rest Request/Response의 형변환을 담당하는 DataConvertor Interface.
 *
 * @author tkyushin
 *
 */
public interface IDataConvertor {

    public static final String ROOT_ARRAY_WRAPPER_KEY = "ROOT_ARRAY_WRAPPER";

    /**
     * Map 유형을 String 유형으로 변경한다.
     *
     * @param string
     * @return
     */
    public Map<String, Object> convertToMap(String string);

    /**
     * String 유형을 Map으로 변경한다.
     *
     * @param data
     * @return
     */
    public String convertToString(Map<String, Object> data);

    /**
     * HTTP Request Content Type을 리턴한다.
     *
     * @return
     */
    public MediaType getRequestMediaType();

    /**
     * HTTP Response Content Type을 리턴한다.
     *
     * @return
     */
    public MediaType getResponseMediaType();

    /**
     * Response Content Type이 주어진 mediaType과 일치하는지 검증한다.
     *
     * @param mediaType
     * @return
     */
    public boolean matchResponseMediaType(MediaType mediaType);

}