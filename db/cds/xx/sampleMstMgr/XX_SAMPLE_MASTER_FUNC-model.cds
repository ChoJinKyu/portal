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
entity Sample_Master_Func(CD: String) {
  key master_id : Integer64 @title : 'Master ID';
  cd : String @title : 'Master Code';
  name : String @title : 'Master Name';
}
