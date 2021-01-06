package lg.sppCap.solutionized.bizrule.okhttp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.okhttp.MediaType;
import lg.sppCap.solutionized.bizrule.rest.IDataConvertor;
import lg.sppCap.solutionized.bizrule.rest.RestAPIConstants;

import java.io.IOException;
import java.util.Map;

/**
 *
 * Rest API 사용시 Map<String, Object> 유형과 Rest Request/Response의 형변환을 담당하는 DataConvertor.
 * 형 변환시 JSON 유형을 사용한다.
 *
 *
 */
public class JSONConvertor implements IDataConvertor {

    protected MediaType requestMediaType;

    protected MediaType responseMediaType;

    public JSONConvertor() {
        requestMediaType = MediaType.parse(RestAPIConstants.CONTENT_TYPE_JSON_UTF8);
        responseMediaType = MediaType.parse(RestAPIConstants.CONTENT_TYPE_JSON_UTF8);
    }

    /**
     * Map 유형을 JSON String 유형으로 변경한다.
     *
     * @param jsonString
     * @return
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> convertToMap(String jsonString){
        try {
            jsonString = jsonString.trim();
            if (jsonString.startsWith("[")) {
                jsonString = "{\"" + ROOT_ARRAY_WRAPPER_KEY + "\" : " + jsonString + " }";
            }
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> map = mapper.readValue(jsonString, Map.class);
            return map;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * JSON String 유형을 Map으로 변경한다.
     *
     * @param data
     * @return
     */
    public String convertToString(Map<String, Object> data){
        try {
            ObjectMapper mapper = new ObjectMapper();
            if (data.containsKey(ROOT_ARRAY_WRAPPER_KEY)) {
                return mapper.writeValueAsString(data.get(ROOT_ARRAY_WRAPPER_KEY));
            }
            String json = mapper.writeValueAsString(data);
            return json;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Response Content Type이 주어진 mediaType과 일치하는지 검증한다.
     *
     * @param mediaType
     * @return
     */
    public boolean matchResponseMediaType(MediaType mediaType){
        MediaType mtype = getResponseMediaType();
        if (mtype == null || mediaType == null) {
            return false;
        }
        return mtype.type().equals(mediaType.type()) && mtype.subtype().equals(mediaType.subtype());
    }

    /**
     * HTTP Request Content Type을 리턴한다.
     *
     * @return
     */
    public MediaType getRequestMediaType(){
        return this.requestMediaType;
    }

    /**
     * HTTP Response Content Type을 리턴한다.
     *
     * @return
     */
    public MediaType getResponseMediaType(){
        return responseMediaType;
    }

    public void setRequestMediaType(MediaType requestMediaType){
        this.requestMediaType = requestMediaType;
    }

    public void setResponseMediaType(MediaType responseMediaType){
        this.responseMediaType = responseMediaType;
    }

}
