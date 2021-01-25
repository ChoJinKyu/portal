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

*************************************************/


namespace xx;

@cds.persistence.exists
entity Sample_Mgr_View {
  key header_id : Integer64;
  detail_id : Integer64;
  header_cd : String;
  header_name : String;
  detail_cd : String;
  detail_name: String;
}
