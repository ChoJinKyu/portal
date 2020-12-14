using { pg.Vp_Vendor_Pool_supplier_Change_List_View as vpChangeList } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_CHANGE_LIST_VIEW-model';
using { cm.Hr_Employee as cmEmp } from '../../../../../db/cds/cm/hrEmployeeMgr/CM_HR_EMPLOYEE-model';
using { cm.Hr_Department as cmDept } from '../../../../../db/cds/cm/hrDeptMgr/CM_HR_DEPARTMENT-model';

namespace pg; 
@path : '/pg.vendorPoolChangeService'
service VpChangeService {
    //https://lgcommondev-workspaces-ws-xqwd6-app1.jp10.applicationstudio.cloud.sap/odata/v2/pg.vendorPoolChangeService/

    entity VpChangeList as projection on vpChangeList;

    view vpEmpView as
    select key he.tenant_id,
           key he.employee_number,
           he.user_local_name || ' ' || he.job_title || ' / ' || hd.department_local_name as user_info : String(100)
    from   cmEmp he,
           cmDept hd
    where  he.tenant_id = hd.tenant_id
    and    he.department_id = hd.department_id
    ;
}