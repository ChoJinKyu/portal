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
namespace pg;

@cds.persistence.exists
entity Md_Character_Code_View(tenant_id: String, company_code: String, org_type_code: String, org_code: String) {
    tenant_id                : String(5) not null   @title : '테넌트ID';
    company_code             : String(10) not null  @title : '회사코드';
    org_type_code            : String(30) not null  @title : '조직유형코드';
    org_code                 : String(10) not null  @title : '조직코드';
    spmd_character_code      : String(4)            @title : 'SPMD특성코드';
    spmd_character_serial_no : Integer64            @title : 'SPMD특성일련번호';
}