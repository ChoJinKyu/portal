namespace dp;

@cds.persistence.exists
entity Mold_Approvals_View {

    key approval_number     : String(50)  not null  @title:'품의번호';
        approval_type_code  : String(30)  not null  @title:'품의유형코드';
        approval_title      : String(300) not null  @title:'품의제목';
        company_name        : String;                
        org_name            : String;               
        requestor_empno     : String(30)            @title:'요청자사번';
        request_date        : String(8)             @title:'요청일자';
        approve_status_code : String(30)            @title:'결재상태코드';
}

