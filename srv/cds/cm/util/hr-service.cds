using {cm.Hr_Employee as employee} from '../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm.User as user} from '../../../../db/cds/cm/CM_USER-model';
using {cm.Hr_Department as Dept} from '../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

namespace cm.util;

@path : '/cm.util.HrService'
service HrService {

    @readonly
    view Employee 
    // @(restrict: [
    //     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
    // ])
    as
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
    view Department 
    // @(restrict: [
    //     { grant: 'READ', where: 'tenant_id = $user.TENANT_ID'}
    // ])
    as
        select
            key d.tenant_id,
            key d.department_id,
                d.department_local_name
        from Dept as d;

    @readonly
    entity Employee_Entity as select from employee mixin {
        DeptInfo: Association to Dept on department_id = DeptInfo.department_id and tenant_id = DeptInfo.tenant_id;
    } into {
        tenant_id,
        employee_number,
        user_local_name,
        email_id,
        mobile_phone_number,
        job_title,
        DeptInfo.department_local_name,
        DeptInfo.department_id
    }

}
