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
  6. entity : Mm_Material_Group
  7. entity description : 자재그룹
  8. history
  -. 2020.11.30 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../../cm/util/util-model';	

entity Mm_Material_Group {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key material_group_code : String(30)  not null @title: '자재그룹코드' ;	
    material_group_name : String(100)  not null @title: '자재그룹명' ;	
    material_group_desc : String(1000)   @title: '자재그룹설명' ;	
}

extend Mm_Material_Group with util.Managed;
