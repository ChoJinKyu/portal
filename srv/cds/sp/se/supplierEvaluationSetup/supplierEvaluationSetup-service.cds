using { cm.Pur_Org_Type_Mapping as orgTypeMapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm.Pur_Operation_Org as operationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { sp.Se_Operation_Unit_Mst as opUnitMst } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MST-model';
using { sp.Se_Operation_Unit_Map as opUnitMap } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MAP-model';
using { sp.Se_Operation_Unit_Manager as opUnitManager } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MANAGER-model';
using { cm.Code_Dtl as codeDtl } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm.Code_Lng as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm.Hr_Employee as employee } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm.Hr_Department as department } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

namespace sp; 
@path : '/sp.supEvalSetupService'
service SupEvalSetupService {
    
    /* Evaluation ORG. (Condition) */
    view SupEvalOrgView as
        select key org.tenant_id,
               key org.company_code,
               key org.org_type_code,
               key org.org_code,
               org_name || map(org.company_code, '*', '', ' (' || org.company_code || ')') org_name: String(100)
        from   orgTypeMapping ma,
               operationOrg org
        where  org.tenant_id = ma.tenant_id
        and    org.company_code = ma.company_code
        and    ma.process_type_code = 'SP08'
        ;

    /* Evaluation Operation Unit Master */
    entity OpUnitMst as projection on opUnitMst;
    
    /* Evaluation Operation Unit VP Mapping */
    entity OpUnitMap as projection on opUnitMap;

    /* Evaluation Operation Unit Manager */
    view managerListView as
        select Key lng.language_cd,
               Key mgr.tenant_id,
               Key mgr.company_code,
               Key mgr.org_type_code,
               Key mgr.org_code,
               Key mgr.evaluation_operation_unit_code,
               Key mgr.evaluation_op_unt_person_empno,
               emp.user_local_name,
               dept.department_local_name,
               mgr.evaluation_execute_role_code,
               ifnull((select code_name
       	               from   codeLng
       	               where  tenant_id = mgr.tenant_id
       	               and    group_code = 'SP_SE_EVAL_EXECUTE_ROLE_CODE'
       	               and    code = mgr.evaluation_execute_role_code
       	               and    language_cd = lng.language_cd), mgr.evaluation_execute_role_code) evaluation_execute_role_name : String(100)
        from   opUnitManager mgr
               left outer join (select tenant_id,
	                                   code language_cd
	                            from   codeDtl
	                            where  group_code = 'CM_LANG_CODE'
	                            and    now() between start_date and end_date) lng
               on    mgr.tenant_id = lng.tenant_id,
               employee emp,
               department dept
        where  mgr.tenant_id = emp.tenant_id
        and    mgr.evaluation_op_unt_person_empno = emp.employee_number
        and    emp.tenant_id = dept.tenant_id
        and    emp.department_id = dept.department_id
        ;

}
