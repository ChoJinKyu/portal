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
  6. service  : Supplier Idea 관리 
  7. service description : 
      1) Idea Status 생성
         -IN : TABLE( TENANT_ID NVARCHAR(5), 
                COMPANY_CODE NVARCHAR(10),
                IDEA_NUMBER NVARCHAR(10),
                IDEA_PROGRESS_STATUS_CODE NVARCHAR(30),
                STATUS_CHANGE_COMMENT NVARCHAR(100),
                USER_ID NVARCHAR(255))
        - OUT :  TABLE (RETURN_CODE NVARCHAR(1), RETURN_MSG_CODE NVARCHAR(30), RETURN_MSG NVARCHAR(1000))
       
  8. history
  -. 2021.01.13 : 최미희 최초작성
  -.  
*************************************************/

namespace dp;
@path : '/dp.SupplierIdeaMgtV4Service'
service SupplierIdeaMgtV4Service {


    // Suppplier Idea 생성 Procedure
    type IdeaStatusIn : {
        tenant_id : String;
        company_code : String;
        idea_number : String;
        idea_progress_status_code : String;
        status_change_comment : String;
        user_id : String;
    }

    type IdeaStatusResult : {
        return_code : String;
        return_msg_code : String;
        return_msg : String;
    }

    action CreateIdeaStatusProc (inputdata : IdeaStatusIn ) returns IdeaStatusResult;

    

    // Suppplier Idea 생성 Procedure
    type IdeaIn : {
        tenant_id : String;
        company_code : String;
        idea_number : String;
        idea_title : String;
        idea_progress_status_code : String;

        supplier_code : String;
        idea_create_user_id : String;
        bizunit_code : String;
        idea_product_group_code : String;
        idea_type_code : String;

        idea_period_code : String;
        idea_manager_empno : String;
        idea_part_desc : String;
        current_proposal_contents : String;
        change_proposal_contents : String;
        
        idea_contents : String;
        attch_group_number : String;
        create_user_id : String;
        update_user_id : String;        
        material_code : String;

        
        purchasing_uom_code : String;
        currency_code : String;
        vi_amount : String;
        monthly_mtlmob_quantity : String;
        monthly_purchasing_amount : String;
        
        annual_purchasing_amount : String;
        perform_contents : String;
        crd_type_code : String;
    }
    action SaveIdeaProc (inputdata : IdeaIn ) returns IdeaStatusResult;


}