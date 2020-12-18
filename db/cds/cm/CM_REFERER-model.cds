namespace cm;

using util from './util/util-model';

entity Referer {
    key tenant_id       : String(5) not null  @title : '테넌트ID';
    key approval_number : String(30) not null @title : '품의번호';
    key referer_empno   : String(30) not null @title : '참조자사번';
}

extend Referer with util.Managed;
