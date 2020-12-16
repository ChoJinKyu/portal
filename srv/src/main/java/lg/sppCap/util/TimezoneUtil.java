package lg.sppCap.util;

import java.time.ZonedDateTime;

public class TimezoneUtil {

    private TimezoneUtil(){
        // private class
    }
    
    public static ZonedDateTime getZonedNow(){
        // ZoneId KST = ZoneId.of("UTC+9");
        long offsetHour = 9L;
        long offsetMinute = 0L;
		ZonedDateTime localNow = ZonedDateTime.now();
        localNow = localNow.plusHours(offsetHour);
        localNow = localNow.plusMinutes(offsetMinute);
        return localNow;
    }

}
