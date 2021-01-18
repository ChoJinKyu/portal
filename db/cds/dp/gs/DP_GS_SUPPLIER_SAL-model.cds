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
  6. entity : Gs_Supplier_Sal
  7. entity description : Global Sourcing Supplier Sales Info
  8. history
  -. 2020.12.21 : 최미희 최초작성
  -. 2021.01.16 : 최미희 컬럼추가 및 Key 변경
        SOURCING_SUPPLIER_ID
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as General } from './DP_GS_SUPPLIER_GEN-model';

entity Gs_Supplier_Sal {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key sourcing_supplier_id : Integer64  not null @title: '소싱공급업체ID' ;

        parent: Association to General.Gs_Supplier_Gen
        on parent.tenant_id = tenant_id 
        and parent.sourcing_supplier_id = sourcing_supplier_id;

      sourcing_supplier_nickname : String(100)  not null @title: '소싱공급업체별칭' ;	
  key txn_year : String(4)  not null @title: '거래년도' ;	
  key customer_english_name : String(240)  not null @title: '고객영문명' ;	
    customer_local_name : String(240)   @title: '고객로컬명' ;	
    annual_txn_amount : Decimal   @title: '연간거래금액' ;	
    sales_weight : Decimal   @title: '매출비중' ;	

}

extend Gs_Supplier_Sal with util.Managed;