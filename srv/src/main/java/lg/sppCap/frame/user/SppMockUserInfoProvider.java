package lg.sppCap.frame.user;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.UserInfoProvider;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
@Profile("!cloud")
public class SppMockUserInfoProvider implements UserInfoProvider {

    private static final String MOCK_USER_FILE = "MockUser.json";

    @Override
    public UserInfo get() {

        Map<String, List<String>> attributes = new HashMap<String, List<String>>();

        JSONParser parser = new JSONParser();
        ClassPathResource classPathResource = new ClassPathResource(MOCK_USER_FILE);

        InputStreamReader inputStreamReader = null;
        try {
            inputStreamReader = new InputStreamReader(classPathResource.getInputStream(), "UTF8");
            
            Object obj = parser.parse(inputStreamReader);
            JSONObject jsonUserInfo = (JSONObject) obj;
            for (Object key : jsonUserInfo.keySet()) {
                attributes.put((String) key, new ArrayList<>(Arrays.asList((String) jsonUserInfo.get(key))));
            }
        } catch (IOException | ParseException e) {
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

        return UserInfo.create().setAttributes(attributes);
        
    }


}
