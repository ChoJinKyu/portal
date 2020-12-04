namespace dp;

using util from '../../cm/util/util-model';

entity Md_Approval_Dtl {

    key approval_number     : String(50)    not null @title:'품의번호';
    key mold_id             : Integer       not null @title:'금형ID';
        approval_type_code  : String(30)    not null @title:'품의유형코드';
}

extend Md_Approval_Dtl with util.Managed;