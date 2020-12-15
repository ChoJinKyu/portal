package lg.sppCap.util;

import java.time.ZonedDateTime;

public class TimezoneUtil {

    private TimezoneUtil(){
        // private class
    }
    
    public static ZonedDateTime getZonedNow(){
        // ZoneId KST = ZoneId.of("UTC+9");
		ZonedDateTime localNow = ZonedDateTime.now();
		return localNow.plusHours(9);
    }

}
