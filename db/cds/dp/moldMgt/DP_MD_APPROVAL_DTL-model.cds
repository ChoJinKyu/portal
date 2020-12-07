namespace dp;

using util from '../../cm/util/util-model';

entity Md_Approval_Dtl {
    key tenant_id           : String(5)    not null @title:'테넌트ID';
    key approval_number     : String(50)   not null @title:'품의번호';
    key mold_id             : String(100)  not null @title:'금형ID';
}

extend Md_Approval_Dtl with util.Managed;