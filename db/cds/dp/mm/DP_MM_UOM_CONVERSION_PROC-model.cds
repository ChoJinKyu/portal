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

namespace dp;

@cds.persistence.exists
entity Mm_Uom_Conversion_Proc(i_tenant_id: String(5), i_from_uom_code: String(3), i_to_uom_code: String(3), i_quantity: Decimal) {
    key o_return_code: String(1);
    o_return_error_code: String(30);
    o_return_error_msg: String(100);
    o_conv_quantity: Decimal;
}


