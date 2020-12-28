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
  6. entity : Gs_Sourcing_Pool_Evaluation
  7. entity description : Global Sourcing Pool Evaluation
  8. history
  -. 2020.12.28 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as Category } from './DP_GS_SOURCING_POOL_CATEGORY-model';

entity Gs_Sourcing_Pool_Evaluation {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key sourcing_supplier_nickname : String(100)  not null @title: '소싱공급업체별칭' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드' ;	

    parent: Association to Category.Gs_Sourcing_Pool_Category
        on parent.tenant_id = tenant_id 
        and parent.sourcing_supplier_nickname = sourcing_supplier_nickname
        and parent.company_code = company_code
        and parent.org_type_code = org_type_code
        and parent.org_code = org_code
        ;

  key evaluation_sequence : Integer  not null @title: '평가순번' ;	
    evaluation_date : Date   @title: '평가일자' ;	
    evaluation_person_empno : String(30)   @title: '평가담당자사번' ;	
    price_score : Integer   @title: '가격점수' ;	
    technical_score : Integer   @title: '재무점수' ;	
    financial_score : Integer   @title: '기술점수' ;	
    quality_score : Integer   @title: '품질점수' ;	
    evaluation_score : Integer   @title: '평가점수' ;	
    sourcing_evaluation_result_code : String(30)   @title: '소싱평가결과코드' ;	
    attch_group_number : String(100)   @title: '첨부파일그룹번호' ;	
}

extend Gs_Sourcing_Pool_Evaluation with util.Managed;