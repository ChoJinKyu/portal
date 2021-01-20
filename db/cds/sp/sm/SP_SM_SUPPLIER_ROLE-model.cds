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
  6. entity : Sm_Supplier_Role
  7. entity description : Supplier Master
  8. history
  -. 2021.01.19 : 정병훈 최초작성
*************************************************/

namespace sp;	
using util from '../../cm/util/util-model';

entity Sm_Supplier_Role {	
  key   tenant_id           : String(5)   not null  @title: '테넌트ID' ;	
  key   supplier_code       : String(10)  not null  @title: '공급업체 코드' ;	
  key   bp_role_code        : String(30)  not null  @title: '공급업체 역할코드' ;	
        old_supplier_code   : String(15)            @title: '이전 공급업체 코드' ;	
}	

extend Sm_Supplier_Role with util.Managed;