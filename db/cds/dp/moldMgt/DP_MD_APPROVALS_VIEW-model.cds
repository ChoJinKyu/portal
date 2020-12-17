namespace dp;

@cds.persistence.exists
entity Md_Approvals_View {

    approval_number     : String(50)            @title:'품의번호';
    approval_type_code  : String(30)            @title:'품의유형코드';
    approval_type       : String(30)            @title:'요청자사번';
    approval_title      : String(300)           @title:'품의제목';
    company_name        : String(50)                            ;
    org_name            : String(50)                            ;
    company_code        : String(50)                            ;
    org_type_code       : String(50)                            ;
    org_code            : String(50)                            ;
    model               : String(100)                           ;
    mold_id             : String(50)                            ;
    mold_number         : String(50)                            ;
    requestor_empno     : String(50)                            ;
    requestor_name      : String(50)                            ;
    request_date        : String(50)                            ;
    approve_status_code : String(50)                            ;
    approve_status      : String(50)                            ;
    approval_contents   : LargeString                           ;
}
