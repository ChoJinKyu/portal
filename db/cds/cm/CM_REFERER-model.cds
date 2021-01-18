namespace cm;

using util from './util/util-model';
using {cm.Approval_Mst as arlMst} from './CM_APPROVAL_MST-model';
using {cm.Hr_Employee as employee} from './CM_HR_EMPLOYEE-model';

entity Referer {
    key tenant_id          : String(5) not null  @title : '테넌트ID';
    key approval_number    : String(30) not null @title : '품의번호';
    key referer_empno      : String(30) not null @title : '참조자사번';

        approval_number_fk : Association to arlMst
                                 on  approval_number_fk.tenant_id       = tenant_id
                                 and approval_number_fk.approval_number = approval_number;
        referer_empno_fk  : Association to employee
                                 on  referer_empno_fk.tenant_id       = tenant_id
                                 and referer_empno_fk.employee_number = referer_empno;
}

extend Referer with util.Managed;
