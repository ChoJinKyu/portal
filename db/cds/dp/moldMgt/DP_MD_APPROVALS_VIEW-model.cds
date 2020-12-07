namespace dp;

@cds.persistence.exists
entity Md_Approvals_View {

    key approval_number     : String(50)  not null  @title:'품의번호';
        approval_type_code  : String(30)            @title:'품의유형코드';
        approval_title      : String(300)           @title:'품의제목';
        company_name        : String(50);                        
        org_name            : String(50);                       
        company_code        : String(50);                      
        org_type_code       : String(50);                     
        org_code            : String(50);                    
        model               : String(50);                   
        mold_id             : String(50);                                        
        requestor_empno     : String(30)            @title:'요청자사번';
        request_date        : String(8)             @title:'요청일자';
        approve_status_code : String(30)            @title:'결재상태코드';
        approval_contents   : LargeString           @title:'품의 내용';
        
}

