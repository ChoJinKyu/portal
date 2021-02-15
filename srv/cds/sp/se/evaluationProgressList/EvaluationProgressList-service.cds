using { sp.Se_Regular_Eval_Sum as eSummary } from '../../../../../db/cds/sp/se/SP_SE_REGULAR_EVAL_SUM-model';
using { sp.Se_Operation_Unit_Mst as opMst } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MST-model';
using { sp.Se_Eval_Type as eType } from '../../../../../db/cds/sp/se/SP_SE_EVAL_TYPE-model';
using { sp.Se_Eval_Target_Supplier as tSupplier } from '../../../../../db/cds/sp/se/SP_SE_EVAL_TARGET_SUPPLIER-model';
using { sp.Se_Eval_Sheet_Eval_Manager as eManager } from '../../../../../db/cds/sp/se/SP_SE_EVAL_SHEET_EVAL_MANAGER-model';
using { cm.Code_Dtl as cdtl } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm.Code_Lng as cLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';

namespace sp; 
@path : '/sp.evalProgressListService'
service EvalProgressListService {

    //평가진행 목록 List View

    view ListView as
    select Key l.language_cd,
           Key s.tenant_id,
           Key s.company_code,
           Key s.org_type_code,
           Key s.org_code,
           Key s.evaluation_operation_unit_code,
           o.evaluation_operation_unit_name,
           Key s.evaluation_type_code,
           et.evaluation_type_name,
           Key s.regular_evaluation_id,
           s.regular_evaluation_year,
           s.regular_evaluation_period_code,
           ifnull((select cd.code_name
                   from   cLng cd
                   where  cd.tenant_id = s.tenant_id
                   and    cd.group_code = 'SP_SE_EVAL_PERIOD_CODE'
                   and    cd.language_cd = l.language_cd
                   and    cd.code = s.regular_evaluation_period_code), s.regular_evaluation_period_code) as regular_evaluation_period_name : String(240),
           s.regular_evaluation_name,
           s.regular_eval_prog_status_cd,
           ifnull((select cd.code_name
                   from   cLng cd
                   where  cd.tenant_id = s.tenant_id
                   and    cd.group_code = 'SP_SE_EVAL_PROGRESS_STATUS_CD'
                   and    cd.language_cd = l.language_cd
                   and    cd.code =  s.regular_eval_prog_status_cd),  s.regular_eval_prog_status_cd) as regular_evaluation_status_nm : String(240),
           s.actual_aggregate_start_date,
           s.actual_aggregate_end_date,
           s.regular_evaluation_exec_str_dt,
           s.regular_evaluation_exec_end_dt,
           (select count(ts.supplier_group_code) as supplier_cnt
            from   tSupplier ts
            where  ts.tenant_id = s.tenant_id
            and    ts.company_code = s.company_code
            and    ts.org_type_code = s.org_type_code
            and    ts.org_code = s.org_code
            and    ts.evaluation_operation_unit_code = s.evaluation_operation_unit_code
            and    ts.evaluation_type_code = s.evaluation_type_code
            and    ts.regular_evaluation_id = s.regular_evaluation_id) as supplier_cnt : Integer,
           (select count(distinct em.evaluation_person_empno) as person_cnt
            from   eManager em
            where  tenant_id =s.tenant_id
            and    company_code = s.company_code
            and    org_type_code = s.org_type_code
            and    org_code = s.org_code
            and    evaluation_operation_unit_code = s.evaluation_operation_unit_code
            and    evaluation_type_code = s.evaluation_type_code
            and    regular_evaluation_id = s.regular_evaluation_id) as manager_cnt : Integer
    from   eSummary as s
           left outer join (select tenant_id,
                                   code language_cd
                            from   cdtl
                            where  group_code = 'CM_LANG_CODE'
                            and    now() between start_date and end_date) l
           on     s.tenant_id = l.tenant_id,
           opMst as o,
           eType et
    where  s.tenant_id = o.tenant_id
    and    s.company_code = o.company_code
    and    s.org_type_code = o.org_type_code
    and    s.org_code = o.org_code
    and    s.evaluation_operation_unit_code = o.evaluation_operation_unit_code
    and    s.tenant_id = et.tenant_id
    and    s.company_code = et.company_code
    and    s.org_type_code = et.org_type_code
    and    s.org_code = et.org_code
    and    s.evaluation_operation_unit_code = et.evaluation_operation_unit_code
    and    s.evaluation_type_code = et.evaluation_type_code
    ;

}