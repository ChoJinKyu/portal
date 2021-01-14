using { sp.Se_Operation_Unit_Mst as opUnitMst } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MST-model';
using { cm.Pur_Operation_Org as operationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { sp.Se_Operation_Unit_Manager as opUnitManager } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MANAGER-model';
using { sp.Se_Eval_Type as evalType } from '../../../../../db/cds/sp/se/SP_SE_EVAL_TYPE-model';

namespace sp;
@path : '/sp.evaluationItemMngtService'
service EvaluationItemMngtService {

    /* User's Evaluation ORG. (Condition) */
    view UserEvalOrgView as
    SELECT DISTINCT 
           key mng.tenant_id,
           key mng.company_code,
           key mng.org_type_code,
           key mng.org_code,
           key cm_org.org_name,
           mng.evaluation_op_unt_person_empno
    FROM   opUnitManager mng
          ,opUnitMst     org
          ,operationOrg  cm_org
    WHERE  mng.tenant_id        = org.tenant_id
    AND    mng.company_code     = org.company_code
    AND    mng.org_type_code    = org.org_type_code
    AND    mng.org_code         = org.org_code
    AND    cm_org.tenant_id     = mng.tenant_id
    AND    cm_org.company_code  = mng.company_code
    AND    cm_org.org_type_code = mng.org_type_code
    AND    cm_org.org_code      = mng.org_code    ;

    /* User's Evaluation Type. (Condition) */
    view UserEvalTypeView as
    SELECT key mng.tenant_id,
           key mng.company_code,
           key mng.org_type_code,
           key mng.org_code,
           key mng.evaluation_operation_unit_code,
           key mng.evaluation_op_unt_person_empno,
           MAX(CASE WHEN et.evaluation_type_code = 'EVAL001' THEN 'Y' ELSE 'N' END) actual_eval: String(1),
           MAX(CASE WHEN et.evaluation_type_code = 'EVAL002' THEN 'Y' ELSE 'N' END) competitive_eval: String(1)
    FROM   opUnitManager mng
          ,opUnitMst     org
          ,evalType      et
    WHERE  mng.tenant_id = org.tenant_id
    AND    mng.company_code = org.company_code
    AND    mng.org_type_code = org.org_type_code
    AND    mng.org_code = org.org_code
    AND    mng.evaluation_operation_unit_code = org.evaluation_operation_unit_code
    AND    et.tenant_id = org.tenant_id
    AND    et.company_code = org.company_code
    AND    et.org_type_code = org.org_type_code
    AND    et.org_code = org.org_code
    AND    et.evaluation_operation_unit_code = org.evaluation_operation_unit_code
    GROUP BY mng.tenant_id
            ,mng.company_code
            ,mng.org_type_code
            ,mng.org_code
            ,mng.evaluation_operation_unit_code
            ,mng.evaluation_op_unt_person_empno;

    /* User's Operation Unit */
    entity UserOperationUnit as projection on opUnitMst;

    /* User's Eval Type */
    entity UserEvalType as projection on evalType;
}