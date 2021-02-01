namespace sp;

using util from '../../cm/util/util-model';
using {cm.Code_Mst} from '../../cm/CM_CODE_MST-model';
using {cm.Code_Dtl} from '../../cm/CM_CODE_DTL-model';
using {cm.Code_Lng} from '../../cm/CM_CODE_LNG-model';
using {cm.Org_Tenant} from '../../cm/CM_ORG_TENANT-model';

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

@cds.autoexpose  // Sc_Pur_Operation_Org = Pur_Org_Type_View[process_type_code='SP03:견적입찰'] + Pur_Operation_Org + Code_Lng[group_code='CM_ORG_TYPE_CODE']
entity Sc_Pur_Operation_Org as
    select from Pur_Org_Type_Mapping as POTM
    inner join Pur_Operation_Org as POO
        on(
            POTM.tenant_id = POO.tenant_id
            and POTM.org_type_code = POO.org_type_code
            and POTM.org_type_code = POO.org_type_code
        )
        and process_type_code = 'SP03'
    mixin {
        org_type : Association to Code_Lng
                       on (    org_type.tenant_id = $projection.tenant_id
                           and org_type.code = $projection.org_type_code )
                       and org_type.group_code = 'CM_ORG_TYPE_CODE'
                       and lower( org_type.language_cd ) = substring( $user.locale, 1, 2 )
                       ;
    }
    into {
        key POO.tenant_id,
        key POO.company_code,
        key POO.org_code,
            POO.org_name,
            POO.org_type_code,
            org_type,
            POO.purchase_org_code,
            POO.plant_code,
            POO.affiliate_code,
            POO.bizdivision_code,
            POO.bizunit_code,
            POO.au_code,
            POO.hq_au_code,
            POO.use_flag
    };

/* select * from cm_Pur_Org_Type_View where 1=1
and TENANT_ID = 'L2100' 
and COMPANY_CODE = '*'
and PROCESS_TYPE_CODE = 'SP03'
; */