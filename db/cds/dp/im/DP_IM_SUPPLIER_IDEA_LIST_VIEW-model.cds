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
  6. entity : DP_IM_SUPPLIER_IDEA_LIST_VIEW
  7. entity description : DP_IM_SUPPLIER_IDEA_LIST_VIEW model cds
  8. history
  -. 2021.01.12 : 최미희 최초작성
*************************************************/
namespace dp;	

@cds.persistence.exists
entity Im_Supplier_Idea_List_View {	
  key tenant_id : String; // '테넌트ID' 	
  key company_code : String; //'회사코드'
  key idea_number : String;   // '아이디어번호'	
    idea_title : String;                 // '아이디어제목'
    idea_progress_status_code : String;  // '아이디어진행상태코드'
    idea_date : Date;                    // '아이디어일자'
    supplier_code : String;              // '공급업체코드' 
    idea_create_user_id : String;        // '아이디어작성사용자ID'
    bizunit_code : String;               // '사업본부코드' ;	
    idea_product_group_code : String;    // '아이디어제품군' ;	
    idea_type_code : String;             // '아이디어유형코드' ;	
    idea_period_code : String;           // '아이디어기간코드' ;	
    idea_manager_empno : String;         // '아이디어관리자사번' ;	
    idea_part_desc : String;             // '아이디어부품설명' ;	
    current_proposal_contents : String;  // '현재제안내용' ;	
    change_proposal_contents : String;   // '변경제안내용' ;	
    idea_contents : LargeBinary;         // '아이디어내용' ;	
    attch_group_number : String;         // '첨부파일그룹번호' ;	
    material_code : String;              // '자재코드' ;	
    purchasing_uom_code : String;        // '구매단위코드' ;	
    currency_code : String;              // '통화코드' ;	
    vi_amount : Decimal;                 // 'VI금액' ;	
    monthly_mtlmob_quantity : Decimal;   // '월물동수량' ;	
    monthly_purchasing_amount : Decimal; // '월간구매금액' ;	
    annual_purchasing_amount : Decimal;  // '연간구매금액' ;	
    perform_contents : String;           // '성과내용' ;
    color_type_code : Decimal;           // '컬러 타입' ;
}