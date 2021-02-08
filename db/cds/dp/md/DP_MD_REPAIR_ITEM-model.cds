namespace dp;

using util from '../../cm/util/util-model';

// 자산
entity Md_Repair_Item {
    key tenant_id : String(5)  not null                     @title : '테넌트ID';
    key repair_request_number : String(100)  not null       @title : '수선요청번호';
        repair_type_code : String(30)                       @title : '수선유형코드';	
        mold_id : String(100)                               @title : '금형ID';
        repair_progress_status_code : String(30)            @title : '수선진행상태코드';	
        repair_desc : String(500)                           @title : '수선설명';
        repair_reason : String(300)                         @title : '수선사유';
        approval_number : String(50)                        @title : '완료품의번호';
        investment_ecst_type_code : String(30)              @title : '투자비용유형코드';
        account_code : String(10)                           @title : 'ACCOUNT_CODE';
        accounting_department_code : String(50)             @title : '회계부서코드';
        remark : String(3000)                               @title : '비고';
        sample_quantity : Decimal                           @title : '샘플수량';
        eco_number : String(45)                             @title : 'ECO번호';
        complete_date : String(8)                           @title : '완료일자';
        repair_amount : Decimal                             @title : '수선금액';
        repair_supplier_code : String(10)                   @title : '수선공급업체코드';
        repair_request_date : String(8)                     @title : '수선요청일자';
        mold_moving_plan_date : String(8)                   @title : '금형이동계획일자';
        mold_moving_result_date : String(8)                 @title : '금형이동결과일자';
        mold_complete_plan_date : String(8)                 @title : '금형완료계획일자';
        mold_complete_result_date : String(8)               @title : '금형완료결과일자';
        repair_complete_date : DateTime                     @title : '수선완료일자';
        repair_quotation_times : Integer                    @title : '수선견적횟수';
        repair_mold_size : String(30)                       @title : '수선금형크기';
        repair_quotation_amount : Decimal                   @title : '수선견적금액';
        repair_supplier_quotation_date : String(8)          @title : '수선공급업체견적일자';
        asset_number : String(100)                          @title : '자산번호';
        repair_request_id : String(100)                     @title : '수리요청ID';
        develope_step_code : String(30)                     @title : '개발단계코드';
        repair_factor : String(30)                          @title : '수선요인';
        project_code : String(30)                           @title : '프로젝트코드';
        activity_code : String(40)                          @title : '활동코드';
        currency_code : String(3)                           @title : '통화코드';
        book_currency_code : String(3)                      @title : '장부통화코드';
        sales_status_code : String(30)                      @title : '매출상태코드';
        pr_number : String(50)                              @title : '구매요청번호';
        acq_department_code : String(50)                    @title : '취득부서코드';
        budget_amount : Decimal                             @title : '예산금액';
        budget_exrate_date : String(8)                      @title : '예산환율일자';
        budget_exrate : Decimal                             @title : '예산환율';
        provisional_budget_amount : Decimal                 @title : '테넌트ID';
        repair_supplier_request_number : String(100)        @title : '수선공급업체요청번호';
        mold_location_type_code : String(30)                @title : '금형위치유형코드';
}

extend Md_Repair_Item with util.Managed;
