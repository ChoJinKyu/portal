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
  6. entity : Im_Supplier_Idea_Status
  7. entity description : 공급업체 Idea Status
  8. history
  -. 2021.01.07 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as Idea } from './DP_IM_SUPPLIER_IDEA-model';

entity Im_Supplier_Idea_Status {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;
  key idea_number : String(10)  not null @title: '아이디어번호' ;	

    parent: Association to Idea.Im_Supplier_Idea
        on parent.tenant_id = tenant_id 
        and parent.company_code = company_code
        and parent.idea_number = idea_number;

  key status_change_sequence : Decimal(5,0)  not null @title: '상태변경순번' ;	
    idea_progress_status_code : String(30)  not null @title: '아이디어진행상태코드' ;	
    status_change_user_id : String(255)   not null @title: '상태변경사용자ID' ;	
    status_change_date_time : DateTime not null @title: '상태변경일시' ;	
    status_change_comment : String(100)   @title: '상태변경주석' ;	
}

extend Im_Supplier_Idea_Status with util.Managed;