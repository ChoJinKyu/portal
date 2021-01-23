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
  6. entity : DP_MM_MTL_COMMODITY_VIEW
  7. entity description : DP_MM_MTL_COMMODITY_VIEW model cds
  8. history
  -. 2021.01.22 : 최미희 최초작성  COMMODITY_CODE
*************************************************/
namespace dp;	

@cds.persistence.exists
entity Mm_Mtl_Commodity_View {	
  key tenant_id : String; // '테넌트ID' 	
  key commodity_code : String; // Commodity 코드
      commodity_name : String; // Commodity 명
      commodity_desc : String; // Commodity 설명
      use_flag : String; // 사용여부
      language_code : String; // 언어코드
}