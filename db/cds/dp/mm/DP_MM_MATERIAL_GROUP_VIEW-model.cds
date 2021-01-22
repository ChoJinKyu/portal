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
  6. entity : DP_MM_MATERIAL_GROUP_VIEW
  7. entity description : DP_MM_MATERIAL_GROUP_VIEW model cds
  8. history
  -. 2021.01.22 : 최미희 최초작성
*************************************************/
namespace dp;	

@cds.persistence.exists
entity Mm_Material_Group_View {	
  key tenant_id : String; // '테넌트ID' 	
  key material_group_code : String; // 자재그룹 코드
      material_group_name : String; // 자재그룹 명
      material_group_desc : String; // 자재그룹 설명
      use_flag : String; // 사용여부
      language_code : String; // 언어코드
}