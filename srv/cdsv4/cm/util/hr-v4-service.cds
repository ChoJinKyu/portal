using {cm as DeptName} from '../../../../db/cds/cm/util/CM_GET_DEPT_NAME_FUNC-model';
using {cm as EmpName} from '../../../../db/cds/cm/util/CM_GET_EMP_NAME_FUNC-model';

namespace cm;

@path : '/cm.HrV4Service'
service HrV4Service {

    // entity Get_Dept_Name_Func(p_tenant_id : String(5), p_department_id : String(100)) as
    //     select from DeptName.Get_Dept_Name_Func (
    //         p_tenant_id : : p_tenant_id, p_department_id : : p_department_id
    //     );

    // entity Get_Emp_Name_Func(p_tenant_id : String(5), p_employee_number : String(30)) as
    //     select from EmpName.Get_Emp_Name_Func (
    //         p_tenant_id : : p_tenant_id, p_employee_number : : p_employee_number
    //     );

}


