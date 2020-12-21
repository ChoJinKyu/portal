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
  6. entity : Gs_Supplier_Fin
  7. entity description : Global Sourcing Supplier Finance Info
  8. history
  -. 2020.12.21 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as General } from './DP_GS_SUPPLIER_GEN-model';

entity Gs_Supplier_Fin {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key sourcing_supplier_nickname : String(100)  not null @title: '소싱공급업체별칭' ;	

        parent: Association to General.Gs_Supplier_Gen
        on parent.tenant_id = tenant_id 
        and parent.sourcing_supplier_nickname = sourcing_supplier_nickname
        ;

  key fiscal_year : String(4)  not null @title: '회계연도' ;	
  key fiscal_quarter : String(2)   @title: '회계분기' ;	
    sales_amount : Decimal   @title: '매출금액' ;	
    opincom_amount : Decimal   @title: '영업이익금액' ;	
    asset_amount : Decimal   @title: '자산금액' ;	
    curasset_amount : Decimal   @title: '유동자산금액' ;	
    nca_amount : Decimal   @title: '비유동자산금액' ;	
    liabilities_amount : Decimal   @title: '부채금액' ;	
    curliablities_amount : Decimal   @title: '유동부채금액' ;	
    ncl_amount : Decimal   @title: '비유동부채금액' ;	
    equity_capital : Decimal   @title: '자기자본금' ;	
}

extend Gs_Supplier_Fin with util.Managed;