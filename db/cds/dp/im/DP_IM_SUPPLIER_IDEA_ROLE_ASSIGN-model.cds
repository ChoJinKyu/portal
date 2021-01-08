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
  6. entity : Im_Supplier_Idea_Role_Assign
  7. entity description : 공급업체 Idea 역할 지정
  8. history
  -. 2021.01.07 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	

entity Im_Supplier_Idea_Role_Assign {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key idea_role_code : String(30)  not null @title: '아이디어역할코드' ;	
  key role_person_empno : String(30)  not null @title: '역할담당자사번' ;	
    bizunit_code : String(10)   @title: '사업본부' ;	
    idea_product_group_code : String(30)   @title: '아이디어제품군코드' ;	
    effective_start_date : Date  not null @title: '유효시작일자' ;	
    effective_end_date : Date  not null @title: '유효종료일자' ;	
}

extend Im_Supplier_Idea_Role_Assign with util.Managed;