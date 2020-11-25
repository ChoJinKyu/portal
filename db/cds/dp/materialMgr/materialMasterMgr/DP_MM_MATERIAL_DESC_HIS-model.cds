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
  6. entity : Mm_Material_Desc_His
  7. entity description : 자재마스터 자재내역 이력
  8. history
  -. 2020.11.25 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../../util/util-model';	

entity Mm_Material_Desc_His {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	
  key language_code : String(4)  not null @title: '언어코드' ;	
  key history_sequence : Integer  not null @title: '이력순번' ;	
    material_description : String(300)   @title: '자재설명' ;	
}

extend Mm_Material_Desc_His with util.Managed;