namespace dp;	
using util from '../../util/util-model'; 	
// using {dp as Uri_Link} from '../standardCommon/DP_SC_URI_LINK-model';	
	
entity Sc_Uri_Link {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key uri_code : String(10)  not null @title: 'URI CODE' ;	
    uri_name : String(2000)   @title: 'URI 이름' ;	
    uri_type : String(10)   @title: 'URI Type' ;	
    if_system : String(2000)   @title: '인터페이스 시스템' ;	
    desc : String(2000)   @title: '설명' ;	
    call_key1 : String(2000)   @title: '호출 키 1' ;	
    call_key2 : String(2000)   @title: '호출 키 2' ;	
    call_key3 : String(2000)   @title: '호출 키 3' ;	
    call_key4 : String(2000)   @title: '호출 키 4' ;	
    call_key5 : String(2000)   @title: '호출 키 5' ;	
    use_yn : Boolean   @title: '사용 여부' ;	
}	
extend Sc_Uri_Link with util.Managed;