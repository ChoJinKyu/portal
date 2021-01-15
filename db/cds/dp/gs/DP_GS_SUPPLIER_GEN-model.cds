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
  
  5. namespace : db
  6. entity : Gs_Supplier_Gen
  7. entity description : Global Sourcing Supplier General Info
  8. history
  -. 2020.12.21 : 최미희 최초작성
  -. 2021.01.14 : 최미희 필드 추가
       SOURCING_SUPPLIER_ID, TAX_ID, SOURCING_CONTENTS 
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	

entity Gs_Supplier_Gen {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key sourcing_supplier_nickname : String(100)  not null @title: '소싱공급업체별칭' ;	
    sourcing_supplier_id : Integer64   @title: '소싱공급업체ID' ;	
    email_address : String(100)  not null @title: '이메일주소' ;	
    develop_date : Date  not null @title: '발굴일자' ;	
    developer_empno : String(30)  not null @title: '발굴자사번' ;	
    sourcing_supplier_local_name : String(240)   @title: '소싱공급업체로컬명' ;	
    sourcing_supplier_english_name : String(240)   @title: '소싱공급업체영문명' ;	
    local_full_address : String(1000)   @title: '로컬전체주소' ;	
    english_full_address : String(1000)   @title: '영문전체주소' ;	
    product_desc : String(300)   @title: '제품설명' ;	
    an_profile : String(100)   @title: 'Ariba Network 프로파일' ;	     	
    tax_id : String(16)   @title: '세금등록번호' ;	
    sourcing_contents : LargeBinary   @title: '소싱내용' ;
    remark : String(3000)   @title: '비고' ;	
    attch_group_number : String(100)   @title: '첨부파일그룹번호' ;	
}

extend Gs_Supplier_Gen with util.Managed;