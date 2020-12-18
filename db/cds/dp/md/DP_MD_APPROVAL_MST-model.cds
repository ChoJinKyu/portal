namespace dp;

using util from '../../cm/util/util-model';

entity Md_Approval_Mst {

    key approval_number     : String(50)  not null  @title:'품의번호';
        approval_type_code  : String(30)  not null  @title:'품의유형코드';
        approval_title      : String(300) not null  @title:'품의제목';
        requestor_empno     : String(30)            @title:'요청자사번';
        request_date        : String(8)             @title:'요청일자';
        approve_status_code : String(30)            @title:'결재상태코드';
        approval_contents   : LargeString           @title:'품의 내용';
}

extend Md_Approval_Mst with util.Managed;