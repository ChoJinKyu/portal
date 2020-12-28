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
  6. entity : Mm_Mtl_User_Favorites
  7. entity description : 자재 사용자 즐겨찾기
  8. history
  -. 2020.12.22 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as MtlMst } from './DP_MM_MATERIAL_MST-model';

entity Mm_Mtl_User_Favorites {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key user_id : String(255)  not null @title: '사용자ID' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	

    parent: Association to MtlMst.Mm_Material_Mst
       on parent.tenant_id = tenant_id 
       and parent.material_code = material_code;
}

extend Mm_Mtl_User_Favorites with util.Managed;