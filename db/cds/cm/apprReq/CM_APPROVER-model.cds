namespace cm;

using util from '../../cm/util/util-model';

entity Approver {	
    key tenant_id           : String(5)  not null   @title:'테넌트ID';
    key approval_number     : String(30) not null   @title:'품의번호';
    key approve_sequence    : String(10) not null   @title:'결재순번';
        approver_type_code  : String(30) not null   @title:'결재자유형코드';
    key approver_empno      : String(30) not null   @title:'결재자사번';
        approve_status_code : String(30)            @title:'결재상태코드';
        approve_comment     : String(500)   　      @title:'결재주석';
        approve_date_time   : DateTime   　         @title:'결재일시';
}

extend Approver with util.Managed;