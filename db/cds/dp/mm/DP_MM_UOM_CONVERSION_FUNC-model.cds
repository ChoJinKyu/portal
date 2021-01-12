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
  6. entity  : DP_MM_UOM_CONVERSION_FUNC
  7. entity description : 단위환산 Function cds
       - Input : I_TENANT_ID NVARCHAR(5)
                 I_FROM_UOM_CODE NVARCHAR(3)
                 I_TO_UOM_CODE NVARCHAR(3)
                 I_QUANTITY DECIMAL
       - Output : O_RETURN_QUANTITY DECIMAL

  8. history
  -. 2021.01.07 : 최미희 최초작성
  -.  
*************************************************/
namespace dp;

@cds.persistence.exists
entity Mm_Uom_Conversion_Func(I_TENANT_ID: String, 
                              I_FROM_UOM_CODE: String,
                              I_TO_UOM_CODE: String,
                              I_QUANTITY: Decimal
                              ) {

  key o_return_quantity : Decimal;

}
