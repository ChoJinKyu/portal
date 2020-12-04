namespace dp;

@cds.persistence.exists
entity Md_Approvals_View {

    key approval_number     : String(50)  not null  @title:'품의번호';
        approval_type_code  : String(30)            @title:'품의유형코드';
        approval_title      : String(300)           @title:'품의제목';
        company_name        : String;                
        org_name            : String;               
        requestor_empno     : String(30)            @title:'요청자사번';
        request_date        : String(8)             @title:'요청일자';
        approve_status_code : String(30)            @title:'결재상태코드';
        approval_contents   : LargeString           @title:'품의 내용';
        tenant_id           : String(5)             @title:'테넌트ID';
        company_code        : String(10)            @title:'회사코드';
        org_type_code       : String(10)            @title:'조직유형코드';
        org_code            : String(10)            @title:'조직코드';
        model               : String(100)           @title:'모델';
        mold_id             : Integer               @title:'금형ID';
        part_number         : String(40)            @title:'부품번호';
}

