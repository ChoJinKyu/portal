namespace sp;

using util from '../../cm/util/util-model';
using {cm.Code_Mst} from '../../cm/CM_CODE_MST-model';
using {cm.Code_Dtl} from '../../cm/CM_CODE_DTL-model';
using {cm.Code_Lng} from '../../cm/CM_CODE_LNG-model';
using {cm.Org_Tenant} from '../../cm/CM_ORG_TENANT-model';

/***********************************************************************************/
/*************************** For NegoHeaders-buyer_empno ***************************/
/*
// Sc_Employee_View = Hr_Employee =+ Hr_Department =+ cm.Org_Company
// #How to use : as association
using { sp.Sc_Employee_View, sp.Sc_Pur_Operation_Org } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
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
    // Cannot Extend with View or Projection, Use view mixin {} into {}

/***********************************************************************************/
/******************* For NegoHeaders-operation_unit_code ***************************/
/******************* For NegoItemPrices-operation_unit_code ************************/
/* 
// #Sc_Pur_Operation_Org == Pur_Org_Type_Mapping[process_type_code='SP03:견적입찰'] = Pur_Operation_Org =+ Code_Lng[group_code='CM_ORG_TYPE_CODE']
// #How to use : as association
using { sp.Sc_Pur_Operation_Org } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        operation_org : association to Sc_Pur_Operation_Org 
            on operation_org.tenant_id = $projection.tenant_id
            and operation_org.company_code = $projection.company_code
            and operation_org.operation_org_code = $projection.operation_unit_code
            ; 
*/

using {cm.Pur_Org_Type_View} from '../../cm/CM_PUR_ORG_TYPE_VIEW-model';
using {cm.Pur_Org_Type_Mapping} from '../../cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm.Pur_Operation_Org} from '../../cm/CM_PUR_OPERATION_ORG-model';

// entity Sc_Pur_Org_Type_Mapping as select from Pur_Org_Type_Mapping distinct {
//     key tenant_id,
//     key map(company_code,'*','%',company_code) as company_code : Pur_Org_Type_Mapping:company_code,
//     key org_type_code
// } where process_type_code = 'SP03' and use_flag = TRUE;

@cds.autoexpose  // Sc_Pur_Operation_Org = Pur_Org_Type_View[process_type_code='SP03:견적입찰'] + Pur_Operation_Org + Code_Lng[group_code='CM_ORG_TYPE_CODE']
entity Sc_Pur_Operation_Org as
    select from Pur_Org_Type_Mapping as POTM
    inner join Pur_Operation_Org as POO
        on ( POTM.tenant_id = POO.tenant_id
            // and POO.company_code like map(POTM.company_code,'*','%',POTM.company_code)            //10,000,000,000 9021 ms
            // and map(POTM.company_code,'*',POO.company_code,POTM.company_code) = POO.company_code  //10,000,000,000 8992 ms
            and map(POTM.company_code,'*','*',POO.company_code) = POTM.company_code                  //10,000,000,000 8951 ms
            and POTM.org_type_code = POO.org_type_code
            ) 
            and POO.use_flag = TRUE
            and POTM.use_flag = TRUE
            and POTM.process_type_code = 'SP03'
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
        key POO.org_code as operation_org_code,
            POO.org_name as operation_org_name,
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

/* 
// #조직 유형 뷰
select * from cm_Pur_Org_Type_View where 1=1
and TENANT_ID = 'L2100' 
and COMPANY_CODE = '*'
and PROCESS_TYPE_CODE = 'SP03'
; 

// #참조 :
VIEW PG_VP_VENDOR_POOL_OPERATION_ORG_VIEW AS
SELECT DISTINCT
       TENANT_ID,
       OPERATION_ORG_CODE,
       OPERATION_ORG_NAME,
       '3' AS ORG_MAX_LEVEL
FROM  (SELECT OO.TENANT_ID,
              OO.ORG_CODE OPERATION_ORG_CODE,
              OO.ORG_NAME OPERATION_ORG_NAME
       FROM   CM_PUR_ORG_TYPE_MAPPING OM,
              CM_PUR_OPERATION_ORG OO
       WHERE  OM.PROCESS_TYPE_CODE = 'PG05'
       AND    OM.TENANT_ID= OO.TENANT_ID
       AND    OM.COMPANY_CODE = OO.COMPANY_CODE
       AND    OM.ORG_TYPE_CODE = OO.ORG_TYPE_CODE
       AND    OO.USE_FLAG = TRUE)
WHERE  OPERATION_ORG_CODE IS NOT NULL
AND    OPERATION_ORG_CODE NOT IN ('BIZ00000')
;
*/




/***********************************************************************************/
/******************* For NegoItemPrices-material_code ******************************/
/* Material Master - Entity Model Relationship 적용되면 폐기예정
// #Sc_Pur_Operation_Org == Pur_Org_Type_Mapping[process_type_code='SP03:견적입찰'] = Pur_Operation_Org =+ Code_Lng[group_code='CM_ORG_TYPE_CODE']
// #How to use : as association
using { sp.Sc_Pur_Operation_Org } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';
        operation_org : association to Sc_Pur_Operation_Org 
            on operation_org.tenant_id = $projection.tenant_id
            and operation_org.company_code = $projection.company_code
            and operation_org.operation_org_code = $projection.operation_unit_code
            ; 
*/

// using { dp as MtlMst } from './DP_MM_MATERIAL_MST-model';
// entity Sc_Mm_Material_Mst as select from Mm_Material_Mst mixin 
// {
//     localized: association to Mm_Material_Desc_Lng on 
// }
// into 
// {
//     *
// };

// Mm_Material_Desc_Lng