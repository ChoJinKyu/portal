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
  
  5. namespace : dp
  6. entity  : Pu_Pr_Template_Numbers_Func
  7. entity description : Parent Tenpate List 반환...
  8. history
  -. 2021.01.20 : 김경태 작성
  -.  
*************************************************/
namespace op;

@cds.persistence.exists
entity Pu_Pr_Template_Numbers_Func(I_TENANT_ID: String, I_PR_TEMPLATE_NUMBER: String) {
  key out_pr_number : String(1000);
}
