/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시
*************************************************/
namespace dp;	
using { User } from '@sap/cds/common';
using util from '../../../util/util-model';
	
entity VI_Base_Price_Arl_Header {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key arl_number : String(100) not null @title: '품의서번호';	
    company_code : String(10)  not null @title: '회사코드';	
    operation_type : String(200) not null @title: '구매운영조직유형';	
    operation_code : String(200) not null @title: '구매운영조직코드';	
    arl_type_code : String(3) not null @title: '품의서유형코드';	
    new_change_code : String(1) not null  @title: '신규변경코드';	
    arl_status : String(3) not null @title: '품의서상태';	
    approval_request_desc : String(3000) not null @title: '승인요청설명';	
    approval_requester_empno : String(100) not null  @title: '승인작성자사번';	
    approval_request_date : Date not null @title: '승인요청일자';	
    attached_file_no : String(30) not null @title: '첨부파일No';		
}	

extend VI_Base_Price_Arl_Header with util.Managed;