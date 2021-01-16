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
  6. entity : Gs_Sourcing_Pool_Category
  7. entity description : Global Sourcing Pool Category
  8. history
  -. 2020.12.28 : 최미희 최초작성
  -. 2021.01.16 : 최미희 컬럼추가 및 Key 변경
        SOURCING_SUPPLIER_ID
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as Supplier } from './DP_GS_SUPPLIER_GEN-model';

entity Gs_Sourcing_Pool_Category {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key sourcing_supplier_id : Integer64  not null @title: '소싱공급업체ID' ;	
    sourcing_supplier_nickname : String(100)  not null @title: '소싱공급업체별칭' ;

    parent: Association to Supplier.Gs_Supplier_Gen
        on parent.tenant_id = tenant_id 
        and parent.sourcing_supplier_id = sourcing_supplier_id
        ;
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드' ;	
/*    vendor_pool_level1_code : String(20)   @title: '협력사풀레벨1코드' ;	
    vendor_pool_level2_code : String(20)   @title: '협력사풀레벨2코드' ;	
    vendor_pool_level3_code : String(20)   @title: '협력사풀레벨3코드' ;	
    vendor_pool_level4_code : String(20)   @title: '협력사풀레벨4코드' ;	
    vendor_pool_level5_code : String(20)   @title: '협력사풀레벨5코드' ;	
*/
    child_part_desc : String(500)   @title: '하위부품설명' ;	

}

extend Gs_Sourcing_Pool_Category with util.Managed;