namespace dp;	
using util from '../../cm/util/util-model';  	
// using { as } from '/DP_PD_PART_CATEGORY_CREATION_REQUEST-model';	
	
entity Pd_Part_Category_Creation_Request {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
    request_number : String(30)   @title: '요청번호' ;	
  key similar_category_code : String(40)  not null @title: '유사카테고리코드' ;	
  key request_title : String(50)  not null @title: '요청제목' ;	
    request_category_name : String(50)   @title: '요청카테고리명' ;	
    requestor_empno : String(30)   @title: '요청자사번' ;	
    request_date_time : DateTime   @title: '요청일시' ;	
    request_desc : LargeBinary   @title: '요청설명' ;	
    attch_group_number : String(100)   @title: '첨부파일그룹번호' ;	
    progress_status_code : String(30)   @title: '요청 진행상태' ;	
}	
extend Pd_Part_Category_Creation_Request with util.Managed;