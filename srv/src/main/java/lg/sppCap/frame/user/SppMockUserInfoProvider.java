package lg.sppCap.frame.user;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.sap.cds.services.request.ModifiableUserInfo;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.UserInfoProvider;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
@Profile("!cloud")
public class SppMockUserInfoProvider implements UserInfoProvider {

    private final static Logger log = LoggerFactory.getLogger(SppMockUserInfoProvider.class);

    private static final String MOCK_USER_FILE = "MockUser.json";

    @Override
    public UserInfo get() {

        Map<String, List<String>> attributes = new HashMap<String, List<String>>();
        Set<String> roles = new HashSet<String>();
        String userName = "anonymous";

        JSONParser parser = new JSONParser();
        ClassPathResource classPathResource = new ClassPathResource(MOCK_USER_FILE);

        InputStreamReader inputStreamReader = null;
        try {
            inputStreamReader = new InputStreamReader(classPathResource.getInputStream(), "UTF8");
            
            Object obj = parser.parse(inputStreamReader);
            JSONObject jsonUserInfo = (JSONObject) obj;
            for (Object key : jsonUserInfo.keySet()) {

                if(jsonUserInfo.get(key).getClass() == JSONArray.class){
                    JSONArray jsonArray = (JSONArray) jsonUserInfo.get(key);
                    List<String> arrayValue = new ArrayList<String>();
                    for(int i = 0; i < jsonArray.size(); i++){
                        arrayValue.add(i, (String) jsonArray.get(i));                        
                    }

                    attributes.put((String) key, arrayValue);

                }else{
                    attributes.put((String) key, new ArrayList<>(Arrays.asList((String) jsonUserInfo.get(key))));
                }

                if("USER_ID".equals((String) key)){
                    userName = (String) jsonUserInfo.get(key);
                }else if("ROLES".equals((String) key)){
                    JSONArray jsonArray = (JSONArray) jsonUserInfo.get(key);
                    for(int i = 0; i < jsonArray.size(); i++){
                        roles.add((String) jsonArray.get(i));
                    }
                }

            }

            //userName = (String) jsonUserInfo.get("USER_ID");
        } catch (IOException | ParseException e) {
            log.error("Please check MockUser.json file. Path : /srv/src/main/resources/");
            e.printStackTrace();
        } finally {
            if(inputStreamReader != null){
                try {
                    inputStreamReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }        

        ModifiableUserInfo modifiableUserInfo = UserInfo.create();
        modifiableUserInfo.setName(userName);
        modifiableUserInfo.setRoles(roles);
        modifiableUserInfo.setAttributes(attributes);
        modifiableUserInfo.setIsAuthenticated(true);
        
        return modifiableUserInfo;

        //return UserInfo.create().setAttributes(attributes);
        
    }


}
