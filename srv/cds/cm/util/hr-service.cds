using {cm.Hr_Employee as employee} from '../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm.User as user} from '../../../../db/cds/cm/CM_USER-model';
using {cm.Hr_Department as Dept} from '../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

namespace cm.util;

@path : '/cm.util.HrService'
service HrService {

    @readonly
    view Employee @(restrict: [
        { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
    ])as
        select
            key e.tenant_id,
            key e.employee_number,
                e.user_local_name,
                e.email_id,
                e.mobile_phone_number, 
                e.job_title,
                d.department_local_name,
                d.department_id
        from employee as e
        left join Dept as d
            on e.department_id = d.department_id
            and e.tenant_id = d.tenant_id
        left join user as u
            on e.employee_number = u.employee_number;

    @readonly
    view Department @(restrict: [
        { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
    ])as
        select
            key d.tenant_id,
            key d.department_id,
                d.department_local_name
        from Dept as d;

}
