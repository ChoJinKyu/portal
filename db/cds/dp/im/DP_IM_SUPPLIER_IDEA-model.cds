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
  6. entity : Im_Supplier_Idea
  7. entity description : 공급업체 Idea 정보
  8. history
  -. 2020.12.30 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	

entity Im_Supplier_Idea {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key idea_number : String(10)  not null @title: '아이디어번호' ;	
    idea_title : String(100)  not null @title: '아이디어제목' ;	
    idea_progress_status_code : String(30)  not null @title: '아이디어진행상태코드' ;
    idea_date : Date not null @title: '아이디어일자';
    supplier_code : String(10)  not null @title: '공급업체코드' ;	
    idea_create_user_id : String(255)  not null @title: '아이디어작성사용자ID' ;	
    bizunit_code : String(10)   @title: '사업본부코드' ;	
    idea_product_group_code : String(30)  not null @title: '아이디어제품군' ;	
    idea_type_code : String(30)  not null @title: '아이디어유형코드' ;	
    idea_period_code : String(30)  not null @title: '아이디어기간코드' ;	
    idea_manager_empno : String(30)   @title: '아이디어관리자사번' ;	
    idea_part_desc : String(100)   @title: '아이디어부품설명' ;	
    current_proposal_contents : String(500)   @title: '현재제안내용' ;	
    change_proposal_contents : String(500)   @title: '변경제안내용' ;	
    idea_contents : LargeString    @title: '아이디어내용' ;	
    attch_group_number : String(100)   @title: '첨부파일그룹번호' ;
    material_code : String(40)  @title: '자재코드' ;	
    purchasing_uom_code : String(3)   @title: '구매단위코드' ;	
    currency_code : String(3)   @title: '통화코드' ;	
    vi_amount : Decimal(20,0)   @title: 'VI금액' ;	
    monthly_mtlmob_quantity : Decimal(20,0)   @title: '월물동수량' ;	
    monthly_purchasing_amount : Decimal(20,0)   @title: '월간구매금액' ;	
    annual_purchasing_amount : Decimal(20,0)   @title: '연간구매금액' ;	
    perform_contents : String(500)   @title: '성과내용' ;
}

extend Im_Supplier_Idea with util.Managed;