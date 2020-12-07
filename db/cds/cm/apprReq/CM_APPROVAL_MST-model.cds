namespace cm;

using util from '../../cm/util/util-model';

entity Approval_Mst {	
    key tenant_id               : String(5)   not null  @title:'테넌트ID';	
    key approval_number         : String(30)  not null  @title:'품의번호';	
        legacy_approval_number  : String(50)            @title:'기존시스템품의번호';	
        company_code            : String(10)            @title:'회사코드';
        chain_code              : String(30)  not null  @title:'체인코드';	
        approval_type_code      : String(30)            @title:'품의유형코드';	
        approval_title          : String(300) not null  @title:'품의제목';	
        approval_contents       : LargeString           @title:'품의 내용';	
        approve_status_code     : String(30)  not null  @title:'결재상태코드';
        requestor_empno         : String(30)            @title:'요청자사번';
        request_date            : String(8)             @title:'요청일자';
        attch_group_number      : String(100)           @title:'첨부파일그룹번호';	
}

extend Approval_Mst with util.Managed;