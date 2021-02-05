package lg.sppCap.util;

import java.io.UnsupportedEncodingException;
import java.util.StringTokenizer;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class StringUtil {
	/**
	 * Logger for this class
	 */
    private final static Logger log = LoggerFactory.getLogger(StringUtil.class);

	/**
	 *
	 * 전달받은 문자열에서 지정한 문자열을 제거한 문자열을 리턴한다.
	 * @param des 변환시킬 문자열
	 * @param del 삭제할 문자열
	 * @return
	 */
	public static String getRemoveChar( String des, String del ) {
		StringTokenizer t = new StringTokenizer( des, del );
		StringBuffer str = new StringBuffer();

		while ( t.hasMoreTokens() ) {
			str.append( t.nextToken() );
		}

		return str.toString();
	}

	/**
	 *
	 * 전달받은 문자열에 space를 넣어서 지정한 길이를 만든다
	 * static 메소드인 fillSpace()를 호출함.
	 *
	 * @param des
	 * @param size
	 * @return
	 */
	public static String getFillSpace(String des, int size) {
		return fillSpace(des, size);
	}

	/**
	 *
	 * 전달받은 문자열에 space를 넣어서 지정한 길이를 만든다
	 *
	 * @param des
	 * @param size
	 * @return
	 */
	public static String fillSpace(String des, int size) {
		StringBuffer str = new StringBuffer();
		// des = replace(des, " ", " ");

		if (des == null) {
			for (int i = 0; i < size; i++)
				str.append(" ");
			return str.toString();
		}

		if (des.trim().length() > size)
			return des.substring(0, size);
		else
			des = des.trim();

		byte[] bDes = des.getBytes();
		int diffsize = size - bDes.length;
		str.append(des);

		for (int i = 0; i < diffsize; i++) {
			str = str.append(" ");
		}

		return str.toString();
	}

	/**
	 *
	 * 전달받은 문자열에 지정된 길이에 맞게 0을 채운다
	 *
	 * @param des
	 * @param size
	 * @return
	 */
	public static String getFillZero(String des, int size) {
		StringBuffer str = new StringBuffer();

		if (des == null) {
			for (int i = 0; i < size; i++)
				str.append("0");
			return str.toString();
		}

		if (des.trim().length() > size)
			return des.substring(0, size);
		else
			des = des.trim();

		int diffsize = size - des.length();

		for (int i = 0; i < diffsize; i++) {
			str = str.append("0");
		}

		str.append(des);

		return str.toString();
	}

	/**
	 *
	 * 전달받은 문자열의 내용이 0인지 검사한다
	 *
	 * @param des
	 * @return
	 */
	public static boolean isZero(String des) {
		if (!isNumeric(des)) return false;

		if (Integer.parseInt(des) == 0) return true;

		return false;
	}

	public static boolean isNumeric(String str) {
		if ( StringUtils.isBlank(str) ) return false;
		return StringUtils.isNumeric(str);
	}


	/**
	 *
	 * 전달받은 문자열이 null값이거나 빈문자열("")일 경우 참을 반환함
	 * StringUtil.isNull(null)      = true
	 * StringUtil.isNull("")        = true
	 * StringUtil.isNull(" ")       = false
	 * StringUtil.isNull("bob")     = false
	 * StringUtil.isNull("  bob  ") = false
	 * @param value
	 * @return
	 */
	public final static boolean isNull(String value) {
		return StringUtils.isEmpty(value);
	}

	/**
	 *
	 * 전달받은 문자열을 숫자로 변환하여 반환하되, 숫자가 아니라면 빈문자열("")을 반환함.
	 *
	 * @param value
	 * @return
	 */
	public final static String getNumber(String value) {
		if ( StringUtils.isBlank(value) ) return "";

		try {
			return Integer.parseInt(value.trim()) + "";
		} catch (NumberFormatException e) {
			log.error("failed to convert to number : " + value, e);
			throw e;
		}
	}

	/**
	 *
	 * 전달받은 문자열이 한칸의 빈칸일 경우 (" ") 참을 반환함
	 *
	 * @param value
	 * @return
	 */
	public final static boolean isSpace(String value) {
		if (value != null && value.equals(" "))
			return true;
		return false;
	}

	/**
	 *
	 * 인자로 전달받은 데이터가 올바른 날짜 데이터인지 검사한다
	 *
	 * @param year
	 * @param month
	 * @param date
	 * @return
	 */
	public static boolean isValidDate(String year, String month, String date) {
		if (year == null || year.length() != 4 || !isNumeric(year))
			return false;

		if (month == null || month.length() > 2 || month.length() <= 0
				|| !isNumeric(month))
			return false;

		if (date == null || date.length() > 2 || date.length() <= 0
				|| !isNumeric(date))
			return false;

		return true;
	}

	/**
	 *
	 * null값이나 문자열 "null"일 경우 빈 문자열("") 로 변환하여 반환함
	 *
	 * @deprecated replaceNull() -> defaultString()
	 * @param str
	 * @return
	 */
	public static String replaceNull(String str) {
		String result = str;

		if (str == null || "null".equals(str)) {
			result = "";
		}

		return result;
	}

	/**
	 *
	 * 스트링 치환 함수 주어진 문자열(buffer)에서 특정문자열('src')를 찾아 특정문자열('dst')로 치환
	 *
	 * @param buffer
	 * @param src
	 * @param dst
	 * @return
	 */
	public static String replaceAll(String buffer, String src, String dst) {
		if (buffer == null)
			return null;
		if (buffer.indexOf(src) < 0)
			return buffer;

		int bufLen = buffer.length();
		int srcLen = src.length();
		StringBuffer result = new StringBuffer();

		int i = 0;
		int j = 0;
		for (; i < bufLen;) {
			j = buffer.indexOf(src, j);
			if (j >= 0) {
				result.append(buffer.substring(i, j));
				result.append(dst);

				j += srcLen;
				i = j;
			} else
				break;
		}
		result.append(buffer.substring(i));
		return result.toString();
	}


	/**
	 *
	 * 전달받은 문자열이 유효한가를 판단하여 반환함
	 * null값이거나, 빈문자열("")이거나, 정수로 변환하여 0이면 false를 반환함
	 *
	 * @param value
	 * @return
	 */
	public final static boolean isValid(String value) {
		if ( StringUtils.isBlank(value) ) return false;

		try {
				return (Integer.parseInt(value.trim()) == 0) ? false : true ;
		} catch (NumberFormatException e) {
			log.error("failed to convert to number : " + value, e);
			throw e;
		}
	}


	/**
	 *
	 * 전달받은 문자열을 가격표시 형태대로 3자리마다 ',' 삽입하여 반환함
	 *
	 * @param dStr
	 * @return
	 */
	public static String getCurrDisplay(String dStr) {
		if (dStr == null)
			return "";

		String sep = ",";
		int sLoc;

		sLoc = dStr.length();

		while (sLoc > 3) {
			dStr = dStr.substring(0, sLoc - 3) + sep + dStr.substring(sLoc - 3);
			sLoc -= 3;
		}

		return dStr;
	}

	/**
	 *
	 * 전달받은 숫자를 문자로 변환하여 가격표시 형태대로 3자리마다 ',' 삽입하여 반환함
	 *
	 * @param dStr
	 * @return
	 */
	public static String getCurrDisplay(int dInt) {
		if (dInt == 0)
			return "0";
		String strMinus = "";
		if( dInt < 0 ) strMinus = "-";
		String dStr = String.valueOf(dInt).replaceAll("-","");
		String sep = ",";
		int sLoc;

		sLoc = dStr.length();

		while (sLoc > 3) {
			dStr = dStr.substring(0, sLoc - 3) + sep + dStr.substring(sLoc - 3);
			sLoc -= 3;
		}

		return strMinus + dStr;
	}

	/**
	 * 한글 깨지지 않도록 byte 자르기
	 *
	 * @param inputStr
	 * @param limit
	 * @return
	 */
	public static String lengthLimit(String inputStr, int limit) {

		if (inputStr == null) return "";
		if (limit <= 0) return inputStr;

		byte[] strbyte = null;
		strbyte = inputStr.getBytes();

		if (strbyte.length <= limit) return inputStr;

		char[] charArray = inputStr.toCharArray();

		int checkLimit = limit;
		for ( int i = 0 ; i < charArray.length ; i++ ) {

			if (charArray[i] < 256) checkLimit -= 1;
			else checkLimit -= 2;

			if (checkLimit <= 0) break;
		}

		// 대상 문자열 마지막 자리가 2바이트의 중간일 경우 제거함
		byte[] newByte = new byte[limit + checkLimit];

		for ( int i = 0 ; i < newByte.length ; i++ ) {
			 newByte[i] = strbyte[i];
		 }

		return new String(newByte);
	 }

	/**
	 * 한글 깨지지 않도록 byte 자르기(~부터~까지)
	 *
	 * @param str 문자열
	 * @param s1 자를 시작위치
	 * @param e1 자를 종료위치
	 * @return
	*/
	public static String strHangleByteCut (String str, int s1, int e1) {
		StringBuffer strBuf	= new StringBuffer();
		byte[] byteHangle	= str.getBytes();

		for(int i=s1; i<e1; i++){
			if((byteHangle[i] & 0x80) == 0x80){
				byte[] hangle = new byte[2];
				hangle[0]	= byteHangle[i];
				hangle[1]	= byteHangle[++i];
				strBuf.append(new String(hangle));
			} else {
				strBuf.append((char)byteHangle[i]);
			}
		}
		return strBuf.toString();
	}

	/**
	 * Method cropByte. 문자열 바이트수만큼 끊어주고, 생략표시하기
	 * @param str 문자열
	 * @param i 바이트수
	 * @param trail 생략 문자열. 예) "..."
	 * @return String
	 */
	public static String cropByte(String str, int i, String trail) {
		if (str==null) return "";
		String tmp = str;
		int slen = 0, blen = 0;
		char c;
		try {
			//if(tmp.getBytes("MS949").length>i) {//2-byte character..
			if(tmp.getBytes("UTF-8").length>i) {//3-byte character..
			  while (blen+1 < i) {
				  c = tmp.charAt(slen);
				  blen++;
				  slen++;
				  if ( c  > 127 ) blen++;
			  }
			   tmp=tmp.substring(0,slen)+trail;
		  }
	  } catch(Exception e) {}
	  return tmp;
	}

	/**
	* Method maskByte. 문자열 바이트수만큼 끊어주고, 뒷 문자는 다른문자로 대체, 최대 길이까지만.
	* @param str 문자열
	* @param i 원본 문자열대로 보여줄 수
	* @param j 최대한 보여줄 바이트수
	* @param trail 대체 문자열. 예) "*"
	* @return String
	*/
	public static String maskByte(String str, int i, int j, String trail) {
	  if (str==null) return "";
	  String tmp = str;
	  int slen = 0, blen = 0;
	  char c;
	  String mask = "";
	  try {
		  //if(tmp.getBytes("MS949").length>i) {//2-byte character..
		  if(tmp.getBytes("UTF-8").length>i) {//3-byte character..
			  while (blen < i) {
				  c = tmp.charAt(slen);
				  blen++;
				  slen++;
				  if ( c  > 127 ) blen++;
			  }
			  tmp=tmp.substring(0,slen);
			  while (blen < str.getBytes("UTF-8").length && blen < j){
				  c = str.charAt(slen);
				  blen++;
				  slen++;
				  if ( c  > 127 ) blen++;
				  mask = mask + trail;
			  }
			  tmp=tmp + mask;
		  }
	  } catch(Exception e) {}
	  return tmp;
	}

	/**
	* Method maskByte. 문자열 마지막을 바이트수만큼 다른문자로 대체
	* @param str 문자열
	* @param i 다른문자로 대체할 문자의 마지막 바이트 수
	* @param trail 생략 문자열. 예) "..."
	* @return String
	*/
	public static String maskLastByte(String str, int i, String trail) {
		if (str==null) return "";
		String tmp = str;
		int slen = 0, blen = 0;
		char c;
		String mask = "";

		try {
		  //if(tmp.getBytes("MS949").length>i) {//2-byte character..
		  int tmpSize = tmp.getBytes("UTF-8").length;
		  if(tmpSize>i) {//3-byte character..
			  while (blen < tmpSize - i) {
				  c = tmp.charAt(slen);
				  blen++;
				  slen++;
				  if ( c  > 127 ) blen++;
			  }
			  for (int j = 0 ; j < i; j++) {
				  mask = mask + trail;
			  }
			  tmp=tmp.substring(0,slen)+mask;
		  }else{
			  for (int j = 1 ; j < tmpSize; j++) {
				  mask = mask + trail;
			  }
			  tmp=tmp.substring(0,1)+mask;
		  }
		} catch(Exception e) {}
		return tmp;
	}

	/**
	* 전화번호 - 붙여서 return
	* @param phoneNum
	* @return
	*/
	public static String convPhoneNumChk(String phoneNum) {

	String phone = "";
	String phone1 = "";
	String phone2 = "";
	String phone3 = "";

	phoneNum = phoneNum.replaceAll("-", "");

	if(10 == phoneNum.length()) {
		phone1 = phoneNum.substring(0,3);
		phone2 = phoneNum.substring(3,6);
		phone3 = phoneNum.substring(6,10);
		phone = phone1 + "-" + phone2 + "-" + phone3;
	} else if(11 == phoneNum.length()) {
		phone1 = phoneNum.substring(0,3);
		phone2 = phoneNum.substring(3,7);
		phone3 = phoneNum.substring(7,11);
		phone = phone1 + "-" + phone2 + "-" + phone3;
	} else {
		phone = phoneNum;
	}

	return phone;

	}

	/**
	 * 숫자 자리에 맟춰서 0 추가 셋팅
	 * @param src , 자리수
	 * @return
	*/
	public static String makeNumber(int num, int length) {
		String src = ""+num;

		return makeNumber(src, length);
	}

	/**
	 * 숫자 자리에 맟춰서 0 추가 셋팅
	 * @param src , 자리수
	 * @return
	*/
	public static String makeNumber(String src, int length) {
		if ( src == null ) src = "0";

		if(src.length() == length) return src;
		byte[] dest = new byte[length];

		if(src.length() < length) {
			for ( int i=0; i < length; i++ )
				dest[i]= '0';
			System.arraycopy(src.getBytes(),0, dest, length - src.length(), src.length() );
		} else {
			System.arraycopy(src.getBytes(),0, dest, 0, length);
		}
		return new String(dest);
	}

	/**
	 * 문자 자리 맞춰서 빈칸 추가 셋팅
	 * @param src , 자리수
	 * @return
	*/
	public static String makeString(String srcStr, int length) {
		if(srcStr==null) srcStr = " ";

		byte[] src = srcStr.getBytes();
		byte[] dest = new byte[length];

		if(src.length == length) {
			return srcStr;
		}

		if(src.length < length) {
			for ( int i=0; i < length; i++ )
				dest[i] = ' ';

			System.arraycopy(src,0, dest,0,src.length );
			return new String(dest);
		} else {
			System.arraycopy(src,0, dest,0, length);
			return new String(dest);
		}
	}

	/**
	 * 문자 자리 맞춰서 빈칸 추가 셋팅 (UTF-8 한글 처리용)
	 * @param src , 자리수
	 * @return
	*/
	public static String makeString2(String srcStr, int length) {
		if(srcStr==null) srcStr = " ";

		byte[] src = srcStr.getBytes();
		int lengthPlus =0;

		// 한글 바이트수 계산할때 UTF-8 일경우 한글자당 3바이트씩 계산되므로 한글일경우 1바이트씩 추가 계산해야한다. 이유는 arrycopy 에서는 한글자당 2바이트 씩 계산되서 촐길이가 줄어든다.
		for(int i=0; i<srcStr.length(); i++) {
			if(Character.getType(srcStr.charAt(i)) == 5) {
				//log.debug("== 한글 : " + srcStr.charAt(i) + ", getType : " + Character.getType(srcStr.charAt(i)));
				lengthPlus++;
			}else {
				//log.debug("== 한글  아님: " + srcStr.charAt(i) + ", getType : " + Character.getType(srcStr.charAt(i)));
			}
		}

		// 설정된 바이트에 추가된 계산한 바이트를 더한 값으로 설정
		int lengthTot = length + lengthPlus;
		byte[] dest = new byte[lengthTot];

		//log.debug("== length : " + length + ", lengthTot : " + lengthTot + ", src.length : " + src.length);
		if(src.length == lengthTot) {
			return srcStr;
		}

		if(src.length < lengthTot) {
			for ( int i=0; i < lengthTot; i++ )
				dest[i] = ' ';

			System.arraycopy(src,0, dest,0,src.length );
			return new String(dest);
		} else {
			System.arraycopy(src,0, dest,0, lengthTot);
			return new String(dest);
		}
	}

	/**
	 * 주어진 문자열에서 모든 제거문자를 제거한 후,
	 * 문자가 제거된 문자열을 리턴한다.
	 *
	 * StringUtil.remove(null, *)							= null
	 * StringUtil.remove("", *)								= ""
	 * StringUtil.remove("queuedz", new char[]{'u','z'})	= "qeed"
	 *
	 * @param str
	 * @param remove
	 * @return
	 */
	public static String remove(String str, char[] remove) {
		String result = str;
		for ( int i = 0; i<remove.length; i++) {
			result = StringUtils.remove(result, remove[i]);
		}
		return result;
	}

	/**
	 * 주어진 문자열에서 모든 제거문자열을 제거한 후,
	 * 문자열이 제거된 문자열을 리턴한다.
	 *
	 * StringUtil.remove(null, *)        = null
	 * StringUtil.remove("", *)          = ""
	 * StringUtil.remove(*, null)        = *
	 * StringUtil.remove(*, "")          = *
	 * StringUtil.remove("queued", "ue") = "qd"
	 * StringUtil.remove("queued", "zz") = "queued"
	 *
	 * @param str
	 * @param remove
	 * @return
	 */
	public static String remove(String str, String remove) {
	   return StringUtils.remove(str, remove);
	}

	/**
	 * 주어진 문자열에서 바꾸하고자하는 문자열을 바꿀 문자열로 대체한다.
	 *
	 * StringUtil.replace(null, *, *)        = null
	 * StringUtil.replace("", *, *)          = ""
	 * StringUtil.replace("any", null, *)    = "any"
	 * StringUtil.replace("any", *, null)    = "any"
	 * StringUtil.replace("any", "", *)      = "any"
	 * StringUtil.replace("aba", "a", null)  = "aba"
	 * StringUtil.replace("aba", "a", "")    = "b"
	 * StringUtil.replace("aba", "a", "z")   = "zbz"
	 *
	 * @param text
	 * @param repl
	 * @param with
	 * @return
	 */
	public static String replace(String text, String repl, String with) {
		return StringUtils.replace(text, repl, with);
	}

	/**
	 * 문자열의 길이를 리턴한다.
	 *
	 * StringUtil.getLength(null)    = 0
	 * StringUtil.getLength("")      = 0
	 * StringUtil.getLength("     ") = 5
	 * StringUtil.getLength("abc")   = 3
	 * StringUtil.getLength(" abc ") = 5
	 *
	 * @param src
	 * @return
	 */
	public static int getLength(String src) {
		if ( StringUtils.isEmpty(src) ) return 0;
		return src.length();
	}

	/**
	 *
	 * 전달받은 문자열의 인코딩을 ksc5601에서 8859_1로 변환하여 반환함
	 *
	 * @param passStr
	 * @return
	 */
	public static String getHanEng(String passStr) {
		try {
			return new String(passStr.getBytes("KSC5601"), "8859_1");
		} catch (UnsupportedEncodingException e) {
			log.error("failed to convert encoding : " + passStr, e);
			throw new RuntimeException(e.getMessage(), e);
		}
	}

	/**
	 *
	 * 전달받은 문자열의 인코딩을 8859_1에서 ksc5601로 변환하여 반환함
	 *
	 * @param passStr
	 * @return
	 */
	public static String getEngHan(String passStr) {
		try {
			return new String(passStr.getBytes("8859_1"), "KSC5601");
		} catch (UnsupportedEncodingException e) {
			log.error("failed to convert encoding : " + passStr, e);
			throw new RuntimeException(e.getMessage(), e);
		}
	}

	/**
	 *
	 * 전달받은 문자열에서 앞부분의 연속된 '0'들을 제거하여 반환함
	 *
	 * @param value
	 * @return
	 */
	public static String eraseZero(String value) {
		if (value == null)
			return "";

		int index = 0;
		value = value.trim();

		for (int i = 0; i < value.length(); i++) {
			if (value.charAt(i) != '0')
				break;
			index++;
		}
		return value.substring(index);
	}

	/**
	 *
	 * 특정 문자열의 왼편에 붙어있는 '0'들을 제거하여 반환함
	 * 로직중복으로 인해서 내용 제거하고 eraseZero() 메소드 호출로 대체
	 *
	 * @param src
	 * @return
	 */
	public static String ltrimZero(String src) {
		return eraseZero(src);
	}

	/**
	 *
	 * 전달받은 문자열에 지정된 길이에 맞게 0을 채운다
	 *
	 * @param value
	 * @param size
	 * @return
	 */
	public static String fillZero(String value, int size) {
		if (value == null || value.equals(""))
			return "";

		int count = size - value.getBytes().length;

		for (int i = 0; i < count; i++) {
			value = "0" + value;
		}

		return value;
	}


	/**
	 * 문자열을 euc-kr에서 8859_1로 디코딩 한다.
	 *
	 * @param str
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static String decode( String str ) {
		return encodeText( str, "euc-kr", "8859_1" );
	}

	 /**
	 * 문자열을 8859_1에서 euc-kr로 인코딩 한다.
	 * @param str
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static String encode( String str ) {
		return encodeText( str, "8859_1", "euc-kr" );
	}

	/**
	 * 문자열 해당코드로 변환한다.
	 *
	 * @param str - String
	 * @param encode - String
	 * @param charsetName - String
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	private static String encodeText( String str, String encode, String charsetName )  {
		String result = null;

		try {
			result = isNull( str ) ? null : new String( str.getBytes( encode ), charsetName );
		} catch ( UnsupportedEncodingException e ) {
			e.printStackTrace();
		}

		return result;
	}

	public static String cutStringToNum( String str, int nCut) {
		return cutStringToNum( str, nCut, ".." );
	}

	public static String cutStringToNum( String str, int nCut, String def ) {
		String tmpStr = switchingNull( str, "" );
		String tmpDef = switchingNull( def, ".." );

		int nDefLen = tmpDef.getBytes().length;
		int nStrLen = tmpStr.getBytes().length;

		if ( nCut > nDefLen && nStrLen > nCut ) {
			byte[] btSrc = tmpStr.getBytes();

			byte[] btTrg = new byte[nCut - nDefLen];
			for ( int nCnt = 0; nCnt < nCut - nDefLen; nCnt++ ) {
				if ( btSrc[nCnt] < 0 ) {
					if ( nCnt + 1 == nCut - nDefLen ) break;
					btTrg[nCnt] = btSrc[nCnt++];
				}
				btTrg[nCnt] = btSrc[nCnt];
			}
			tmpStr = new String( btTrg ) + tmpDef;
		}

		return tmpStr;
	}


	public static String switchingNull(String str1, String str2) {
		if(isNull(str1)) {
			return str2;
		}else{
			return str1;
		}
	}

}
