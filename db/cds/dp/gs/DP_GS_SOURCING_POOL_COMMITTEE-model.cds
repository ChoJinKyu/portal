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
  6. entity : Gs_Sourcing_Pool_Committee
  7. entity description : Global Sourcing Pool Committee Report
  8. history
  -. 2020.12.28 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as Category } from './DP_GS_SOURCING_POOL_CATEGORY-model';
using { dp as Evaluation } from './DP_GS_SOURCING_POOL_EVALUATION-model';

entity Gs_Sourcing_Pool_Committee {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key sourcing_supplier_nickname : String(100)  not null @title: '소싱공급업체별칭' ;
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드' ;
  key evaluation_sequence : Integer  not null @title: '평가순번' ;	

    parent: Association to Evaluation.Gs_Sourcing_Pool_Evaluation
        on parent.tenant_id = tenant_id 
        and parent.sourcing_supplier_nickname = sourcing_supplier_nickname
        and parent.company_code = company_code
        and parent.org_type_code = org_type_code
        and parent.org_code = org_code
        and parent.evaluation_sequence = evaluation_sequence
        ;

    progress_date : Date   @title: '진행일자' ;	
    attendants_desc : String(500)   @title: '참석자설명' ;	
    committee_result_code : String(30)   @title: '위원회결과코드' ;	
    remark : String(3000)   @title: '비고' ;	
    attch_group_number : String(100)   @title: '첨부파일그룹번호' ;	
}

extend Gs_Sourcing_Pool_Committee with util.Managed;