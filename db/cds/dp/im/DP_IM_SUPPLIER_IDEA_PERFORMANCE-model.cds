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
  6. entity : Im_Supplier_Idea_Performance
  7. entity description : 공급업체 Idea 성과
  8. history
  -. 2020.12.30 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	

entity Im_Supplier_Idea_Performance {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key idea_number : String(100)  not null @title: '아이디어번호' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	
    purchasing_uom_code : String(3)   @title: '구매단위코드' ;	
    currency_code : String(3)   @title: '통화코드' ;	
    vi_amount : Decimal   @title: 'VI금액' ;	
    monthly_mtlmob_quantity : Decimal   @title: '월물동수량' ;	
    monthly_purchasing_amount : Decimal   @title: '월간구매금액' ;	
    annual_purchasing_amount : Decimal   @title: '연간구매금액' ;	
    perform_contents : String(500)   @title: '성과내용' ;	
}

extend Im_Supplier_Idea_Performance with util.Managed;