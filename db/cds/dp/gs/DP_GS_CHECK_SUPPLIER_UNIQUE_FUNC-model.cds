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
  6. entity  : DP_GS_CHECK_SUPPLIER_UNIQUE_FUNC
  7. entity description : Global Sourcing Supplier 별칭 중복 체크 Function cds
       - Input : I_TENANT_ID NVARCHAR(5)
                 I_SUPPLIER_NICKNAME NVARCHAR(3)
       - Output : TABLE (RETURN_CODE NVARCHAR(1),
                         RETURN_MSG_CODE NVARCHAR(30), 
                         RETURN_MSG NVARCHAR(100))
  8. history
  -. 2021.01.07 : 최미희 최초작성
  -.  
*************************************************/
namespace dp;

@cds.persistence.exists
entity Gs_Check_Supplier_Unique_Func(I_TENANT_ID: String, I_SUPPLIER_NICKNAME: String) {
  key return_code : String;
      return_msg_code : String;
      return_msg : String;
}
