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
  6. entity : Mm_Material_Attr_Ctrl
  7. entity description : 자재마스터 속성 제어
  8. history
  -. 2020.11.25 : 최미희 최초작성
*************************************************/

namespace dp;	
using util from '../../cm/util/util-model';	

entity Mm_Material_Attr_Ctrl {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key table_name : String(50)  not null @title: '테이블명' ;	
  key column_name : String(50)  not null @title: '컬럼명' ;	
    attribute_group_text : String(50)   @title: '속성그룹텍스트' ;	
    attribute_name : String(50)   @title: '속성명' ;	
    hide_column_flag : Boolean default false  @title: '숨김컬럼여부' ;	
    display_column_flag : Boolean default false   @title: '조회컬럼여부' ;	
    mandatory_column_flag : Boolean default false  @title: '필수컬럼여부' ;	
    input_column_flag : Boolean default false  @title: '입력컬럼여부' ;	
}

extend Mm_Material_Attr_Ctrl with util.Managed;