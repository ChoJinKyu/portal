package lg.sppCap.solutionized.bizrule.okhttp;

import lg.sppCap.solutionized.bizrule.rest.GetParameter;
import lg.sppCap.solutionized.bizrule.rest.PathVariable;
import lg.sppCap.solutionized.bizrule.rest.RestAPIConstants;
import lg.sppCap.solutionized.bizrule.rest.IDataConvertor;

import java.io.IOException;
import java.util.Map;

import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Request.Builder;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

/**
 * OKHttpClient 를 사용하여 HTTP Method 별 호출 메소드를 제공한다. <br/>
 * 제공 호출 메소드는 아래와 같다.
 * <ul>
 * <li>GET</li>
 * <li>POST(삽입)</li>
 * <li>PUT(전체수정)</li>
 * <li>PATCH(부분수정)</li>
 * <li>DELTE(삭제)</li>
 * </ul>
 * 기본적으로 request / response Body에 JSON 형식으로 주고 받도록 구현 되어 있다.
 * 다른 형식으로 주고 받아야 할 경우 {@link IDataConvertor}의 구현체를 제공하여 대체할 수 있다. <br/>
 */
public class OKHttpRestAPI {

    /**
     * request / response Body를 처리할 수 있는 {@link IDataConvertor}
     */
    protected IDataConvertor dataConvertor;

    public OKHttpRestAPI() {
        this(new JSONConvertor());
    }

    public OKHttpRestAPI(IDataConvertor convertor) {
        this.dataConvertor = convertor;
    }

    /**
     * OKHttpClient 를 사용하여 Http GET Method 호출 메소드를 제공한다. <br/>
     * 주어진 inData 는 모두 Get Parameter로 치환되어 전달된다. <br/>
     * 또한 URL 구성 중 일부의 치환이 필요한 경우 {key}와 같은 형태로 사용할 수 있다.
     * inData의 값 중 key에 해당되는 값이 있으면 {key}는 해당 데이터로 치환될 것이다.<br/>
     *
     * @see PathVariable
     * @param url
     * @param inData
     * @return
     */
    public Map<String, Object> doGet(String url, Map<String, Object> inData){
        StringBuffer sb = new StringBuffer();
        sb.append(PathVariable.convert(url, inData));
        sb.append(GetParameter.getGetParamter(inData));
        String fullURL = sb.toString();
        try {
            OkHttpClient client = getOkHttpClient();
            Request request = createRequestBuilder(fullURL).get().build();
            Response response = execute(client, request);
            Map<String, Object> outData = handleResponse(response);
            return outData;
        } catch (IOException e) {
            throw new RuntimeException("Rest API Call failed (GET) : " + fullURL, e);
        }
    }

    /**
     * OKHttpClient 를 사용하여 Http Post Method 호출 메소드를 제공한다. <br/>
     * 주어진 inData 는 모두 HTTP Body로 치환되어 전달되며 JSON Content Type을 사용한다. <br/>
     * 또한 URL 구성 중 일부의 치환이 필요한 경우 {key}와 같은 형태로 사용할 수 있다.
     * inData의 값 중 key에 해당되는 값이 있으면 {key}는 해당 데이터로 치환될 것이다.<br/>
     *
     * @see PathVariable
     * @param url
     * @param inData
     * @return
     */
    public Map<String, Object> doPost(String url, Map<String, Object> inData){
        String fullURL = PathVariable.convert(url, inData);
        try {
            OkHttpClient client = getOkHttpClient();
            Request request = createRequestBuilder(fullURL)//
                    .post(createRequestBody(inData)) //
                    .build();
            Response response = execute(client, request);
            Map<String, Object> outData = handleResponse(response);
            return outData;
        } catch (IOException e) {
            throw new RuntimeException("Rest API Call failed (POST) : " + fullURL, e);
        }
    }

    /**
     * OKHttpClient 를 사용하여 Http Put Method 호출 메소드를 제공한다. <br/>
     * 주어진 inData 는 모두 HTTP Body로 치환되어 전달되며 JSON Content Type을 사용한다. <br/>
     * 또한 URL 구성 중 일부의 치환이 필요한 경우 {key}와 같은 형태로 사용할 수 있다.
     * inData의 값 중 key에 해당되는 값이 있으면 {key}는 해당 데이터로 치환될 것이다.<br/>
     *
     * @see PathVariable
     * @param url
     * @param inData
     * @return
     */
    public Map<String, Object> doPut(String url, Map<String, Object> inData){
        String fullURL = PathVariable.convert(url, inData);
        try {
            OkHttpClient client = getOkHttpClient();
            Request request = createRequestBuilder(fullURL)//
                    .put(createRequestBody(inData)) //
                    .build();
            Response response = execute(client, request);
            Map<String, Object> outData = handleResponse(response);
            return outData;
        } catch (IOException e) {
            throw new RuntimeException("Rest API Call failed (PUT) : " + fullURL, e);
        }
    }

    /**
     * OKHttpClient 를 사용하여 Http Patch Method 호출 메소드를 제공한다. <br/>
     * 주어진 inData 는 모두 HTTP Body로 치환되어 전달되며 JSON Content Type을 사용한다. <br/>
     * 또한 URL 구성 중 일부의 치환이 필요한 경우 {key}와 같은 형태로 사용할 수 있다.
     * inData의 값 중 key에 해당되는 값이 있으면 {key}는 해당 데이터로 치환될 것이다.<br/>
     *
     * @see PathVariable
     * @param url
     * @param inData
     * @return
     */
    public Map<String, Object> doPatch(String url, Map<String, Object> inData){
        String fullURL = PathVariable.convert(url, inData);
        try {
            OkHttpClient client = getOkHttpClient();
            Request request = createRequestBuilder(fullURL)//
                    .patch(createRequestBody(inData)) //
                    .build();
            Response response = execute(client, request);
            Map<String, Object> outData = handleResponse(response);
            return outData;
        } catch (IOException e) {
            throw new RuntimeException("Rest API Call failed (PATCH) : " + fullURL, e);
        }
    }

    /**
     * OKHttpClient 를 사용하여 Http Delete Method 호출 메소드를 제공한다. <br/>
     * 주어진 inData 는 모두 HTTP Body로 치환되어 전달되며 JSON Content Type을 사용한다. <br/>
     * 또한 URL 구성 중 일부의 치환이 필요한 경우 {key}와 같은 형태로 사용할 수 있다.
     * inData의 값 중 key에 해당되는 값이 있으면 {key}는 해당 데이터로 치환될 것이다.<br/>
     *
     * @see PathVariable
     * @param url
     * @param inData
     * @return
     */
    public Map<String, Object> doDelete(String url, Map<String, Object> inData){
        String fullURL = PathVariable.convert(url, inData);
        try {
            OkHttpClient client = getOkHttpClient();
            Request request = createRequestBuilder(fullURL)//
                    .delete(createRequestBody(inData)) //
                    .build();
            Response response = execute(client, request);
            Map<String, Object> outData = handleResponse(response);
            return outData;
        } catch (IOException e) {
            throw new RuntimeException("Rest API Call failed (DELETE) : " + fullURL, e);
        }
    }

    /**
     * inData로 HTTP Request시에 Body로 사용할 데이터를 생성한다
     * 기본값은 {@link RestAPIConstants#CONTENT_TYPE_JSON_UTF8}에 정의된 {@value RestAPIConstants#CONTENT_TYPE_JSON_UTF8} 값이며
     * 변경이 필요한 경우 override 하여 사용할 수 있다.
     *
     * @param inData
     * @return
     */
    protected RequestBody createRequestBody(Map<String, Object> inData){
        String jsonBody = getDataConvertor().convertToString(inData);
        return RequestBody.create(getDataConvertor().getRequestMediaType(), jsonBody);
    }

    /**
     * Rest API를 실행하고 Response를 리턴한다. Response의 Content Type이 일치하는지 체크한다.
     *
     * @param client
     * @param request
     * @return
     * @throws IOException
     */
    protected Response execute(OkHttpClient client, Request request) throws IOException{
        Response response = client.newCall(request).execute();
        String ctHeader = response.header(RestAPIConstants.CONTENT_TYPE_HEADER);
        MediaType responseContentType = (ctHeader == null ? null : MediaType.parse(ctHeader));

        if (!getDataConvertor().matchResponseMediaType(responseContentType)) {
            throw new RuntimeException("Response Content type is not " + getDataConvertor().getRequestMediaType() + " : " + request.url());
        }

        return response;
    }

    /**
     * Response 의 Body String을 {@link IDataConvertor}를 사용하여 Map<String, Object> 형태로 변환한다.
     *
     * @param response
     * @return
     * @throws IOException
     */
    protected Map<String, Object> handleResponse(Response response) throws IOException{
        String jsonString = response.body().string();
        Map<String, Object> outData = getDataConvertor().convertToMap(jsonString);
        return outData;
    }

    /**
     * OKHttpClient의 Request Builder를 생성하여 리턴한다. 필요한 작업이 있을 경우 Override 하여 사용한다.
     *
     * @param url
     * @return
     */
    protected Builder createRequestBuilder(String url){
        return new Request.Builder().url(url);
    }

    /**
     * OkHttpClient Instance를 새로 생성하여 리턴한다.
     *
     * @return
     */
    protected OkHttpClient getOkHttpClient(){
        OkHttpClient instance = OkHttpClientInstance.getInstance();
        return instance;
    }

    /**
     * {@link IDataConvertor}를 리턴한다.
     *
     * @return
     */
    public IDataConvertor getDataConvertor(){
        return dataConvertor;
    }

    /**
     * {@link IDataConvertor}를 설정한다.
     *
     * @param dataConvertor
     */
    public void setDataConvertor(IDataConvertor dataConvertor){
        this.dataConvertor = dataConvertor;
    }

}
