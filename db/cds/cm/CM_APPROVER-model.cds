namespace cm;

using util from './util/util-model';
using {cm.Approval_Mst as arlMst} from './CM_APPROVAL_MST-model';
using {cm.Hr_Employee as employee} from './CM_HR_EMPLOYEE-model';

entity Approver {
    key tenant_id           : String(5) not null  @title : '테넌트ID';
    key approval_number     : String(30) not null @title : '품의번호';
    key approve_sequence    : String(10) not null @title : '결재순번';
    key approver_empno      : String(30) not null @title : '결재자사번';
        approver_type_code  : String(30) not null @title : '결재자유형코드';
        approve_status_code : String(30)          @title : '결재상태코드';
        approve_comment     : String(500)         @title : '결재주석';
        approve_date_time   : DateTime            @title : '결재일시';

        approval_number_fk  : Association to arlMst
                                  on  approval_number_fk.tenant_id       = tenant_id
                                  and approval_number_fk.approval_number = approval_number;
        approver_empno_fk   : Association to employee
                                  on  approver_empno_fk.tenant_id       = tenant_id
                                  and approver_empno_fk.employee_number = approver_empno;
}

extend Approver with util.Managed;
