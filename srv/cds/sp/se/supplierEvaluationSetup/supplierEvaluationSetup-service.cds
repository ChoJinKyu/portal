using { cm.Pur_Org_Type_Mapping as orgTypeMapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm.Pur_Operation_Org as operationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { sp.Se_Operation_Unit_Mst as opUnitMst } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MST-model';
using { sp.Se_Operation_Unit_Map as opUnitMap } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MAP-model';
using { sp.Se_Operation_Unit_Manager as opUnitManager } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MANAGER-model';
using { cm.Code_Dtl as codeDtl } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm.Code_Lng as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm.Hr_Employee as employee } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm.Hr_Department as department } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using { sp.Se_Eval_Type as evalType } from '../../../../../db/cds/sp/se/SP_SE_EVAL_TYPE-model';
using { sp.Se_Quantitative_Item as qttiveItem } from '../../../../../db/cds/sp/se/SP_SE_QUANTITATIVE_ITEM-model';
using { sp.Se_Eval_Grade as evalGrade } from '../../../../../db/cds/sp/se/SP_SE_EVAL_GRADE-model';


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
        and    org.org_type_code = ma.org_type_code
        and    ma.process_type_code = 'SP08'
        ;

    /* Evaluation Operation Unit Master */
    view SupEvalOpUnitListView as
    select Key tenant_id,
           Key company_code,
           Key org_type_code,
           Key org_code,
           Key evaluation_operation_unit_code,
           evaluation_operation_unit_name,
           use_flag,
           case when (select distinct
                             evaluation_operation_unit_code
                      from   opUnitManager
                      where  tenant_id = mst.tenant_id
                      and    company_code = mst.company_code
                      and    org_type_code = mst.org_type_code
                      and    org_code = mst.org_code
                      and    evaluation_operation_unit_code = mst.evaluation_operation_unit_code) = mst.evaluation_operation_unit_code then 'N'
                when  (select distinct
                              evaluation_operation_unit_code
                       from   evalType
                       where  tenant_id = mst.tenant_id
                       and    company_code = mst.company_code
                       and    org_type_code = mst.org_type_code
                       and    org_code = mst.org_code
                       and    evaluation_operation_unit_code = mst.evaluation_operation_unit_code) = mst.evaluation_operation_unit_code then 'N'
                when  (select distinct
                              evaluation_operation_unit_code
                       from   qttiveItem
                       where  tenant_id = mst.tenant_id
                       and    company_code = mst.company_code
                       and    org_type_code = mst.org_type_code
                       and    org_code = mst.org_code
                       and    evaluation_operation_unit_code = mst.evaluation_operation_unit_code) = mst.evaluation_operation_unit_code then 'N'
                else 'Y'
            end delete_flag : String(1)
        from   opUnitMst mst
        ;

    view OpUnitListView as
    select Key lng.language_cd,
           Key mst.tenant_id,
           Key mst.company_code,
           Key mst.org_type_code,
           Key mst.org_code,
           Key mst.evaluation_operation_unit_code,
           mst.evaluation_operation_unit_name,
           mst.distrb_score_eng_flag,
           mst.evaluation_request_mode_code,
           mst.evaluation_request_approval_flag,
           mst.operation_plan_flag,
           mst.eval_apply_vendor_pool_lvl_no,
           mst.use_flag,
           Key ma.vendor_pool_operation_unit_code,
           (select cd.code_name
            from   codeLng cd
            where  cd.tenant_id = mst.tenant_id
            and    cd.group_code = 'SP_SM_SUPPLIER_TYPE'
            and    cd.language_cd = lng.language_cd
            and    cd.code =  ma.vendor_pool_operation_unit_code) as vendor_pool_operation_unit_name : String(500)
    from   opUnitMst as mst,
           opUnitMap as ma,
           (select tenant_id,
                   code language_cd
            from   codeDtl
            where  group_code = 'CM_LANG_CODE'
            and    now() between start_date and end_date) lng
    where  mst.tenant_id = ma.tenant_id
    and    mst.company_code = ma.company_code
    and    mst.org_type_code = ma.org_type_code
    and    mst.org_code = ma.org_code
    and    mst.evaluation_operation_unit_code = ma.evaluation_operation_unit_code
    and    mst.tenant_id = lng.tenant_id
    ;

    view OpUnitView as
    select Key language_cd,
	       Key tenant_id,
	       Key company_code,
           Key org_type_code,
           Key org_code,
           Key evaluation_operation_unit_code,
           evaluation_operation_unit_name,
           distrb_score_eng_flag,
           evaluation_request_mode_code,
           evaluation_request_approval_flag,
           operation_plan_flag,
           eval_apply_vendor_pool_lvl_no,
           use_flag,
           string_agg(vendor_pool_operation_unit_code,',') as vendor_pool_operation_unit_code : String(500),
           string_agg(vendor_pool_operation_unit_name,',') as vendor_pool_operation_unit_name : String(500)
	from   OpUnitListView
	group by language_cd,
	         tenant_id,
	         company_code,
	         org_type_code,
	         org_code,
	         evaluation_operation_unit_code,
             evaluation_operation_unit_name,
             distrb_score_eng_flag,
             evaluation_request_mode_code,
             evaluation_request_approval_flag,
             operation_plan_flag,
             eval_apply_vendor_pool_lvl_no,
             use_flag
    ;    

    /* Evaluation Operation Unit Manager */
    view managerListView as
        select Key mgr.tenant_id,
               Key mgr.company_code,
               Key mgr.org_type_code,
               Key mgr.org_code,
               Key mgr.evaluation_operation_unit_code,
               Key mgr.evaluation_op_unt_person_empno,
               emp.user_local_name,
               dept.department_local_name,
               mgr.evaluation_execute_role_code
        from   opUnitManager mgr,
               employee emp,
               department dept
        where  mgr.tenant_id = emp.tenant_id
        and    mgr.evaluation_op_unt_person_empno = emp.employee_number
        and    emp.tenant_id = dept.tenant_id
        and    emp.department_code = dept.department_code
        ;

    /* Evaluation Type List */
    view evalTypeListView as
        select Key typ.tenant_id,
               Key typ.company_code,
               Key typ.org_type_code,
               Key typ.org_code,
               Key typ.evaluation_operation_unit_code,
               Key typ.evaluation_type_code,
               typ.evaluation_type_name,
               typ.evaluation_type_distrb_score_rate,
               typ.use_flag,
               case when (select distinct evaluation_type_code
                          from   evalGrade
                          where  tenant_id = typ.tenant_id
                          and    company_code = typ.company_code
                          and    org_type_code = typ.org_type_code
                          and    org_code = typ.org_code
                          and    evaluation_operation_unit_code = typ.evaluation_operation_unit_code
                          and    evaluation_type_code = typ.evaluation_type_code) = typ.evaluation_type_code then 'N'
                    else 'Y'
               end delete_flag : String(1)
        from   evalType typ
        ;

    entity EvalType as projection on  evalType;

    /* Evaluation Operation Unit Quantitative Item List */
    entity QttiveItem as projection on qttiveItem;

    /* Evaluation Operation Unit Scale List */
    entity EvalGrade as projection on evalGrade;


}
