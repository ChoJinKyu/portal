namespace dp;

@cds.persistence.exists
entity Md_Approvals_View {

    key approval_number : String(30)  not null  @title:'품의번호';
    key tenant_id       : String(5)  not null  @title:'테넌트ID';
    approval_type_code  : String(30)            @title:'품의유형코드';
    approval_type       : String(240)            @title:'요청자사번';
    approval_title      : String(300)           @title:'품의제목';
    company_name        : String(240)                            ;
    org_name            : String(240)                            ;
    company_code        : String(10)                            ;
    org_type_code       : String(10)                            ;
    org_code            : String(10)                            ;
    model               : String(100)                           ;
    mold_id             : String(100)                           ;
    mold_number         : String(40)                            ;
    requestor_empno     : String(30)                            ;
    requestor_name      : String(240)                           ;
    request_date        : String(8)                            ;
    approve_status_code : String(30)                            ;
    approve_status      : String(240)                            ;
    approval_contents   : LargeString                           ;
    email_id            : String(240)                           ;
    sort_no             : Decimal                            ;
    mold_sequence       : String(100)                           ;
}
