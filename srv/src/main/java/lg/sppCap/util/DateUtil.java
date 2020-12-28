package lg.sppCap.util;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.commons.lang3.StringUtils;

public final class DateUtil {
	
	public static final String DEFAULT_DATE_FORMAT = "yyyyMMdd";

	static final long DAY = 86400000; // 24 * 60 * 60 * 1000

	/**
	 * check date string validation with the default format "yyyy-MM-dd".
	 * 
	 * @param s date string you want to check with default format "yyyy-MM-dd".
	 */
	public static void check(String s) throws Exception {
		DateUtil.check(s, "yyyy-MM-dd");
	}

	/**
	 * check date string validation with an user defined format.
	 * 
	 * @param s      date string you want to check.
	 * @param format string representation of the date format. For example,
	 *               "yyyy-MM-dd".
	 */
	public static void check(String s, String format) throws java.text.ParseException {
		if (s == null)
			throw new NullPointerException("date string to check is null");
		if (format == null)
			throw new NullPointerException("format string to check date is null");

		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(format, java.util.Locale.KOREA);
		java.util.Date date = null;
		try {
			date = formatter.parse(s);
		} catch (java.text.ParseException e) {
			throw new java.text.ParseException(e.getMessage() + " with format \"" + format + "\"", e.getErrorOffset());
		}

		if (!formatter.format(date).equals(s))
			throw new java.text.ParseException("Out of bound date:\"" + s + "\" with format \"" + format + "\"", 0);
	}

	/**
	 * check date string validation with the default format "yyyyMMdd".
	 * 
	 * @param s date string you want to check with default format "yyyyMMdd"
	 * @return boolean true 날짜 형식이 맞고, 존재하는 날짜일 때 false 날짜 형식이 맞지 않거나, 존재하지 않는 날짜일 때
	 */
	public static boolean isValid(String s) throws Exception {
		return DateUtil.isValid(s, "yyyyMMdd");
	}

	/**
	 * check date string validation with an user defined format.
	 * 
	 * @param s      date string you want to check.
	 * @param format string representation of the date format. For example,
	 *               "yyyy-MM-dd".
	 * @return boolean true 날짜 형식이 맞고, 존재하는 날짜일 때 false 날짜 형식이 맞지 않거나, 존재하지 않는 날짜일 때
	 */
	public static boolean isValid(String s, String format) {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(format, java.util.Locale.KOREA);
		java.util.Date date = null;
		try {
			date = formatter.parse(s);
		} catch (java.text.ParseException e) {
			return false;
		}

		if (!formatter.format(date).equals(s))
			return false;

		return true;
	}

	/**
	 * @return formatted string representation of current day with "yyyy-MM-dd".
	 */
	public static String getDateString() {
		return getDateString("-");
	}

	/**
	 * @return formatted string representation of current day with "yyyy-MM-dd".
	 */
	public static String getDateString(String delim) {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy" + delim + "MM" + delim + "dd",
				java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 *
	 * For example, String time = DateTime.getFormatString("yyyy-MM-dd HH:mm:ss");
	 *
	 * @param java.lang.String pattern "yyyy, MM, dd, HH, mm, ss and more"
	 * @return formatted string representation of current day and time with your
	 *         pattern.
	 */
	public static String getFormatString(String pattern) {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(pattern, java.util.Locale.KOREA);
		String dateString = formatter.format(new java.util.Date());
		return dateString;
	}

	/**
	 * @return formatted string representation of current day with "yyyyMMdd".
	 */
	public static String getShortDateString() {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMdd", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * @return formatted string representation of current time with "HHmmss".
	 */
	public static String getShortTimeString() {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("HHmmss", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * @return formatted string representation of current time with
	 *         "yyyy-MM-dd-HH:mm:ss".
	 */
	public static String getTimeStampString() {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss,SSS",
				java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * @return formatted string representation of current time with "HH:mm:ss".
	 */
	public static String getTimeString() {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("HH:mm:ss,SSS", java.util.Locale.KOREA);
		return formatter.format(new java.util.Date());
	}

	/**
	 * 이전 날짜구하기
	 */
	public static java.util.Date getBeforeDate(int howDay, String toDay) {
		java.util.Date currentDate = null;

		try {
			int year = Integer.parseInt(toDay.substring(0, 4));
			int month = Integer.parseInt(toDay.substring(4, 6));
			int day = Integer.parseInt(toDay.substring(6, 8));

			java.util.Calendar rightNow = java.util.Calendar.getInstance();
			rightNow.set(year, month - 1, day);
			currentDate = rightNow.getTime();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

		java.util.Date willBeforeDate = new java.util.Date();
		willBeforeDate.setTime(currentDate.getTime() - ((long) howDay * DAY));

		return willBeforeDate;
	}

	/**
	 * 이후 날짜구하기
	 */
	public static java.util.Date getAfterDate(int howDay, String toDay) {
		java.util.Date currentDate = null;

		try {
			int year = Integer.parseInt(toDay.substring(0, 4));
			int month = Integer.parseInt(toDay.substring(4, 6));
			int day = Integer.parseInt(toDay.substring(6, 8));

			java.util.Calendar rightNow = java.util.Calendar.getInstance();
			rightNow.set(year, month - 1, day);
			currentDate = rightNow.getTime();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

		java.util.Date willAfterDate = new java.util.Date();
		willAfterDate.setTime(currentDate.getTime() + ((long) howDay * DAY));

		return willAfterDate;
	}

	/**
	 * 오늘날짜구하기
	 */
	public static String getDateFromDateStr(String toDay, String format) {
		java.util.Date currentDate = null;

		try {
			int year = Integer.parseInt(toDay.substring(0, 4));
			int month = Integer.parseInt(toDay.substring(4, 6));
			int day = Integer.parseInt(toDay.substring(6, 8));

			java.util.Calendar rightNow = java.util.Calendar.getInstance();
			rightNow.set(year, month - 1, day);
			currentDate = rightNow.getTime();

			return getFormattedDateString(currentDate, format);
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}

	public static String getAfterStringDate(int howDay, String toDay, String seperator) {
		java.util.Date after = getAfterDate(howDay, toDay);
		java.util.Calendar calendar = new java.util.GregorianCalendar();
		calendar.setTime(after);

		int month = calendar.get(Calendar.MONTH) + 1;
		String monthStr = "";
		if (month < 10) {
			monthStr = "0" + String.valueOf(month);
		} else {
			monthStr = String.valueOf(month);
		}

		int day = calendar.get(java.util.Calendar.DAY_OF_MONTH);
		String dayStr = "";
		if (day < 10) {
			dayStr = "0" + String.valueOf(day);
		} else {
			dayStr = String.valueOf(day);
		}

		return String.valueOf(calendar.get(java.util.Calendar.YEAR)) + seperator + monthStr + seperator + dayStr;
	}

	public static String getBeforeStringDate(int howDay, String toDay, String seperator) {
		Date before = getBeforeDate(howDay, toDay);
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(before);

		int month = calendar.get(Calendar.MONTH) + 1;
		String monthStr = "";
		if (month < 10) {
			monthStr = "0" + String.valueOf(month);
		} else {
			monthStr = String.valueOf(month);
		}

		int day = calendar.get(java.util.Calendar.DAY_OF_MONTH);
		String dayStr = "";
		if (day < 10) {
			dayStr = "0" + String.valueOf(day);
		} else {
			dayStr = String.valueOf(day);
		}

		return String.valueOf(calendar.get(java.util.Calendar.YEAR)) + seperator + monthStr + seperator + dayStr;
	}

	public static String getFormattedDateString(java.util.Date date, String format) {
		return (new java.text.SimpleDateFormat(format)).format(date);
	}

	/**
	 * 날짜 문자열에서 delimiter가 표기된 형태로 보여준다.
	 * 
	 * @return the translated string.
	 * @param date String 변환할 문자열
	 */
	public static String printDate(String date) {
		if (date == null)
			return "";
		return date.substring(0, 10).replace('-', '/');
	}

	/**
	 * 날짜 문자열에서 delimiter가 표기된 형태로 보여준다.
	 * 
	 * @return the translated string.
	 * @param date      String 변환할 문자열
	 * @param seperator char delimiter
	 */
	public static String printDate(String date, char seperator) {
		if (date == null)
			return "";
		return date.substring(0, 10).replace('-', seperator);
	}

	/**
	 * 날짜시간 문자열에서 delimiter가 표기된 형태로 보여준다.
	 * 
	 * @return the translated string.
	 * @param date String 변환할 문자열
	 */
	public static String printDateTime(String date) {
		if (date == null)
			return "";
		return date.substring(0, 16).replace('-', '/');
	}

	/**
	 * 현재날짜조회
	 * 
	 * @return 현재날짜
	 */
	public static String getCurrentDate() {
		return getCurrentDate("yyyyMMdd");
	}

	/**
	 * 현재날짜조회
	 * 
	 * @return 현재날짜배열
	 */
	public static String[] getCurrentDates() {
		String curDate = getCurrentDate("yyyyMMdd");
		return new String[] { curDate.substring(0, 4), curDate.substring(4, 6), curDate.substring(6, 8) };
	}

	/**
	 * 현재날짜조회
	 * 
	 * @param formatDate 날짜 형식 지정
	 * @return 현재날짜
	 */
	public static String getCurrentDate(String formatDate) {
		Calendar cal = Calendar.getInstance();
		java.text.DateFormat df = new java.text.SimpleDateFormat(formatDate);

		String str = df.format(cal.getTime());
		return str;
	}

	/**
	 * 지정 날짜를 년, 월, 일 배열로 자르기
	 *
	 * @param date 배열로 만들 날짜
	 * @return 날짜 배열
	 */
	public static String[] getDates(String date) {
		String[] str = null;
		boolean bDate = true;

		if (date == null || date.length() != 8)
			bDate = false;

		for (int nCnt = 0; nCnt < date.length(); nCnt++) {
			if (!Character.isDigit(date.charAt(nCnt))) {
				bDate = false;
				break;
			}
		}

		if (bDate)
			str = new String[] { date.substring(0, 4), date.substring(4, 6), date.substring(6, 8) };
		else
			str = getCurrentDates();

		return str;
	}

	/**
	 * 해당 날짜를 비교해서 이후 날짜여부 체크
	 * 
	 * @location : DateTime.getAfterDateChk
	 * @param inDate1 기준날짜
	 * @param inDate2 비교할날짜
	 * @return 이후날짜여부
	 */
	public static boolean getAfterDateChk(String inDate1, String inDate2) {

		boolean isCheck = true;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

			// Ex) inDate1='20081001000', inDate2='20081031235959'
			if (inDate1.length() == 14 && inDate2.length() == 14) {

				Date date1 = sdf.parse(inDate1);
				Date date2 = sdf.parse(inDate2);

				if (date2.after(date1))
					isCheck = true;
				else
					isCheck = false;
			}

		} catch (Exception e) {
		}
		return isCheck;
	}

	/**
	 * 해당 날짜를 비교해서 이후 날짜여부 체크
	 * 
	 * @location : DateTime.getAfterDateChk
	 * @param inDate1 기준날짜
	 * @param inDate2 비교할날짜
	 * @return 이후날짜여부
	 */
	public static boolean getAfterDateChk(String inDate1, Date inDate2) {

		boolean isCheck = true;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

			String stDate2 = sdf.format(inDate2);

			// Ex) inDate1='20081001000', inDate2='20081031235959'
			if (inDate1.length() == 14 && stDate2.length() == 14) {

				Date date1 = sdf.parse(inDate1);
				Date date2 = sdf.parse(stDate2);

				if (date2.after(date1))
					isCheck = true;
				else
					isCheck = false;
			}

		} catch (Exception e) {
		}
		return isCheck;
	}

	/**
	 * 첫번째 인자의 날짜를 기준으로 두 번째 인자의 개월 수를 더한 yyyymmdd 형태의 날짜를 반환
	 *
	 * @param ymd
	 * @param month
	 * @return
	 */
	public static String getAddDateByMonth(String ymd, int month) {
		return getAddDate(ymd, Calendar.MONTH, month);
	}

	/**
	 * 특정문자형 날짜형식의 특별한 타입의 일정량을 증가하거나 감소한 문자열을 반환( yyyymmdd )
	 *
	 * @param date
	 * @param type
	 * @param amt
	 * @return
	 */
	public static String getAddDate(String date, int type, int amt) {
		// 캘린더 객체 생성
		Calendar cal = Calendar.getInstance();

		// 문자열 날짜로 변환하여 시간 세팅
		cal.setTime(getDate(date));
		// 더함
		cal.add(type, amt);

		return getDate(cal.getTime());
	}

	/**
	 * 설정된 날자정보의 yyyymmdd형의데이타를 반환
	 *
	 * @return
	 */
	public static String getDate(Date date) {
		return new SimpleDateFormat("yyyyMMdd").format(date);
	}

	/**
	 * yyyymmdd형식에 맞는 스트링 형식의 날짜를 Date 객체로 생성하여 반환함
	 *
	 * @param date yyyymmdd형식의 날자스트링
	 * @return
	 */
	public static Date getDate(String date) {
		// 연월일 분리
		int year = Integer.parseInt(date.substring(0, 4));
		int month = Integer.parseInt(date.substring(4, 6)) - 1;
		int day = Integer.parseInt(date.substring(6, 8));

		// 캘린더 객체 생성 및 세팅
		Calendar cal = Calendar.getInstance();
		cal.set(year, month, day, 0, 0, 0);

		return cal.getTime();
	}

	/**
	 * 두 스트링형 날짜 사이에 차이나는 일수를 구하여 반환함
	 *
	 * @param date1 날짜스트링1
	 * @param date2 날짜스트링2
	 * @return
	 */
	public static long getDateGap(String date1, String date2) {
		return getDateGap(getDate(date1), getDate(date2));
	}

	/**
	 * 두 날짜타입의 차이나는 일수를 구하여 반환함
	 *
	 * @param date1 대상날짜 1
	 * @param date2 대상날짜 2
	 * @return
	 */
	public static long getDateGap(Date date1, Date date2) {

		// 첫번째 날짜의 타임스탬프 구함
		long time1 = date1.getTime();
		long time2 = date2.getTime();

		return new BigDecimal(Math.ceil((double) (time1 - time2) / 1000 / 60 / 60 / 24)).longValue();

	}

	/**
	 * 두 날짜의 크기를 비교하여 date1이 크면 1, 같으면 0, 작으면 -1을 반환
	 *
	 * @param date1
	 * @param date2
	 * @return
	 */
	public static int compareDate(final String date1, final String date2) {

		for (int i = 0; i < date1.length(); i++) {
			if (date1.charAt(i) > date2.charAt(i)) {
				return 1;
			} else if (date1.charAt(i) < date2.charAt(i)) {
				return -1;
			} else {
				continue;
			}
		}
		return 0;

	}

	/**
	 * 두개의 시간을 받아서 시간안인지 여부 판단
	 *
	 * @param String
	 * @param String
	 * @return
	 */
	public static String getDirectPrimeOrderYn(String fromMin, String toMin) {
		SimpleDateFormat format = new SimpleDateFormat("yy-MM-dd HH:mm:ss");
		String resYn = "N";

		if (StringUtils.isEmpty(fromMin) || StringUtils.isEmpty(toMin)) {
			return resYn;
		}

		try {
			Date fromDate = format.parse(DateUtil.getFormatString("yyyy-MM-dd " + fromMin + ":00:00"));
			Date toDate = format.parse(DateUtil.getFormatString("yyyy-MM-dd " + toMin + ":00:00"));
			Date todayDate = format.parse(DateUtil.getFormatString("yyyy-MM-dd HH:mm:ss"));

			if (fromDate.getTime() <= todayDate.getTime() && toDate.getTime() > todayDate.getTime()) {
				resYn = "Y";
			}
		} catch (Exception e) {
			e.getMessage();
		}

		return resYn;
	}

	/**
	 * 주어진 날자를 특정 패턴형식으로 변환한다.
	 *
	 * DateUtil.format(new Date(), "yyyy/MM/dd") = 2007/09/12 DateUtil.format(new
	 * Date(), "yyyy/MM/dd HH:mm:ss") = 2007/09/12 20:25:10
	 *
	 * @param date
	 * @return
	 */
	public static String format(final Date date, final String pattern) {
		SimpleDateFormat df = new SimpleDateFormat();
		df.applyPattern(pattern);

		return df.format(date);
	}

	/**
	 * 현재 날짜를 스트링 형태로 반환 예) 20031010
	 *
	 * @return 현재날짜
	 */
	public static String getCurrDate() {
		return getCurrDate("");
	}

	/**
	 * 전달받은 토큰으로 형식화 한 현재 날짜를 스트링 형태로 반환 예) 2003-10-10
	 *
	 * @param tok
	 * @return 형식화된 현재날짜
	 */
	public static String getCurrDate(final String tok) {
		return new SimpleDateFormat("yyyy" + tok + "MM" + tok + "dd").format(new Date());
	}

	/**
	 * 주어진 날자를 일자(yyyyMMdd)형 문자열로 변환한다.
	 *
	 * ex) 20070912
	 *
	 * @param date
	 * @return
	 */
	public static String formatDate(final Date date) {
		return format(date, DEFAULT_DATE_FORMAT);
	}

	/**
	 * 첫번째 인자의 날짜를 기준으로 두 번째 인자의 일 수를 더한 yyyymmdd 형태의 날짜를 반환
	 *
	 * @param ymd
	 * @param day
	 * @return
	 */
	public static String getAddDateByDay(final String ymd, final int day) {
		return getAddDate(ymd, Calendar.DATE, day);
	}

}