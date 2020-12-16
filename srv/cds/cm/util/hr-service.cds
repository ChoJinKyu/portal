using { cm.Hr_Employee as employee } from '../../../../db/cds/cm/hrEmployeeMgr/CM_HR_EMPLOYEE-model';
using { cm.User as user } from '../../../../db/cds/cm/userMgr/CM_USER-model';
using { cm.Hr_Department as Dept } from '../../../../db/cds/cm/hrDeptMgr/CM_HR_DEPARTMENT-model';

namespace cm.util;

@path : '/cm.util.HrService'
service HrService {

    @readonly
    view Employee as
        select 
            key e.tenant_id,
            key e.employee_number,
                e.user_local_name
        from employee as e
            left join user as u
                on e.employee_number = u.employee_number
    ;

    @readonly
    view Department as
        select 
            key d.tenant_id,
            key d.department_id,
                d.department_local_name
        from Dept as d
    ;
    
}