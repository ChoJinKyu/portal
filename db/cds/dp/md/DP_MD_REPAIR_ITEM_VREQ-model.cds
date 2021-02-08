namespace dp;

using util from '../../cm/util/util-model';

// 자산
entity Md_Repair_Item_Vreq {
    key tenant_id : String(5)  not null                             @title : '테넌트ID';	
    key repair_supplier_request_number : String(100)  not null      @title : '수선공급업체요청번호';	    
    asset_number : String(30)                                       @title : '자산번호';	
    repair_type_code : String(30)                                   @title : '수선유형코드';	
    repair_progress_status_code : String(30)                        @title : '수선진행상태코드';
    mold_id : String(100)                                           @title : '금형ID';	
    remark : String(3000)                                           @title : '비고';	
    repair_supplier_code : String(10)                               @title : '수선공급업체코드';	
    repair_request_date : String(8)                                 @title : '수선요청일자';	
    mold_moving_plan_date : String(8)                               @title : '금형이동계획일자';	
    mold_moving_result_date : String(8)                             @title : '금형이동결과일자';	
    mold_complete_plan_date : String(8)                             @title : '금형완료계획일자';	
    mold_complete_result_date : String(8)                           @title : '금형완료결과일자';	
    title : String(300)                                             @title : '제목';	
    reject_reason : String(3000)                                    @title : '반려사유';	
}

extend Md_Repair_Item_Vreq with util.Managed;
