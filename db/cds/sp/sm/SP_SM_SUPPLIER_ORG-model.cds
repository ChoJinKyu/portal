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
  
  5. namespace : sp
  6. entity : Sm_Supplier_Org 
  7. entity description : Supplier Master
  8. history
  -. 2021.01.19 : 정병훈 최초작성
*************************************************/
    
namespace sp;   
using util from '../../cm/util/util-model';
using { sp as SupMst } from './SP_SM_SUPPLIER_MST-model';

entity Sm_Supplier_Org {   
  key   tenant_id                       : String(5)   not null  @title: '테넌트ID' ;	  
  key   company_code                    : String(10)  not null  @title: '회사코드' ;	
    
    parent: Association to SupMst.Sm_Supplier_Mst
        on parent.tenant_id = tenant_id 
        and parent.supplier_code  = supplier_code ;
    
  key   org_type_code                   : String(2)   not null  @title: '조직 유형 코드' ;	
  key   org_code                        : String(10)  not null  @title: '조직 코드' ;	
  key   supplier_type_code              : String(30)  not null  @title: '공급업체 유형 코드' ;	
  key   supplier_code                   : String(10)  not null  @title: '공급업체 코드' ;	
        supplier_status_code            : String(1)             @title: '공급업체 상태코드' ;	
        supplier_register_status_code   : String(30)            @title: '공급업체 진행상태 코드' ;	
        supplier_register_progress_code : String(30)            @title: '공급업체 등록진행 코드' ;	
        biz_request_reason              : String(1000)          @title: '거래희망 사유' ;	
}   

extend Sm_Supplier_Org with util.Managed;