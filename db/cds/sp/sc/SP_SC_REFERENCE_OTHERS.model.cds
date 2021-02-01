namespace sp;

using util from '../../cm/util/util-model';

/* ToBe 
Operating Org
db/cds/cm/CM_PUR_ORG_TYPE_VIEW-model.cds
db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model.cds
db/cds/cm/CM_PUR_OPERATION_ORG-model.cds
( PUR_ORG_TYPE_MAPPING-PROCESS_TYPE_CODE  & ORG_TYPE_CODE )
PUR_OPERATION_ORG-ORG_CODE
PUR_OPERATION_ORG-ORG_NAME
*/


/***********************************************************************************/
/*************************** For NegoHeaders-buyer_empno ***************************/
// Sc_Employee_View = Hr_Employee =+ Hr_Department =+ cm.Org_Company
/* How to Use:
        buyer_employee : Association to Sc_Employee_View    //UseCase        
                            on buyer_employee.tenant_id = $self.tenant_id
                              and buyer_employee.employee_number = $self.buyer_empno;
*/
using {cm.Hr_Employee} from '../../cm/CM_HR_EMPLOYEE-model';
using {cm.Hr_Department} from '../../cm/CM_HR_DEPARTMENT-model';
using {cm.Org_Company} from '../../cm/CM_ORG_COMPANY-model';
@cds.autoexpose  // Sc_Employee_View = Hr_Employee + Hr_Department
define entity Sc_Employee_View as select from Hr_Employee as he
    left outer join Hr_Department as hd
    on he.tenant_id = hd.tenant_id 
      and he.department_id = hd.department_id
    left outer join Org_Company as oc
    on hd.tenant_id = oc.tenant_id 
      and hd.company_id = oc.company_code
    {
        key he.tenant_id,
        key he.employee_number,
            map($user.locale,'ko',he.user_korean_name
                            ,'en',he.user_english_name
                            , he.user_local_name)
                    as employee_name : Hr_Employee: user_local_name,
            he.department_id as department_code: Hr_Department: department_id,
            map($user.locale,'ko',hd.department_korean_name
                            ,'en',hd.department_english_name
                            , hd.department_local_name)
                    as department_name : Hr_Department: department_local_name,
            coalesce(nullif(hd.company_id,''),'LGCKR') as company_code : Org_Company: company_code,
            map($user.locale,'en',hd.company_english_name
                            // ,'ko',hd.company_korean_name
                            , hd.company_local_name)
                    as company_name : Org_Company: company_name
    };
    // Cannot Extent with View or Projection
    // extend Sc_Employee_View with {
    //     company : Association to Org_Company
    //         on      company.tenant_id = $self.tenant_id
    //             and company.company_code = $self.company_code
    // };
    


/***********************************************************************************/
/*************************** For NegoHeaders-buyer_empno ***************************/
// Sc_Employee_View = Hr_Employee =+ Hr_Department =+ cm.Org_Company
/* How to Use:
        buyer_employee : Association to Sc_Employee_View    //UseCase        
                            on buyer_employee.tenant_id = $self.tenant_id
                              and buyer_employee.employee_number = $self.buyer_empno;
*/
/* ToBe 
Operating Org
db/cds/cm/CM_PUR_ORG_TYPE_VIEW-model.cds
db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model.cds
db/cds/cm/CM_PUR_OPERATION_ORG-model.cds
( PUR_ORG_TYPE_MAPPING-PROCESS_TYPE_CODE  & ORG_TYPE_CODE )
PUR_OPERATION_ORG-ORG_CODE
PUR_OPERATION_ORG-ORG_NAME
*/
using {cm.Pur_Org_Type_View} from '../../cm/CM_PUR_ORG_TYPE_VIEW-model';
using {cm.Pur_Org_Type_Mapping} from '../../cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm.Pur_Operation_Org} from '../../cm/CM_PUR_OPERATION_ORG-model';