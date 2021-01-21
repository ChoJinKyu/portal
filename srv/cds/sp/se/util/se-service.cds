using { cm.Pur_Operation_Org as operationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { sp.Se_Operation_Unit_Manager as opUnitManager } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MANAGER-model';
using { sp.Se_Eval_Type as evalType } from '../../../../../db/cds/sp/se/SP_SE_EVAL_TYPE-model';
using { sp.Se_Operation_Unit_Mst as opUnitMst } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MST-model';

namespace sp;
@path : '/sp.evaluationUtilService'
service EvaluationUtilService{

    /* User's Evaluation ORG. (Condition) : 평가조직 */
    @readonly
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
    AND    cm_org.org_code      = mng.org_code    
    AND    mng.evaluation_execute_role_code = 'MAIN';

    /* User's Evaluation Unit. (Condition) : 평가운영단위 */
    @readonly
    view UserEvalUnitView as
    SELECT key mng.tenant_id,
           key mng.company_code,
           key mng.org_type_code,
           key mng.org_code,
           key mng.evaluation_operation_unit_code,
           org.evaluation_operation_unit_name,
           key mng.evaluation_op_unt_person_empno
    FROM   opUnitManager mng
          ,opUnitMst     org
    WHERE  mng.tenant_id = org.tenant_id
    AND    mng.company_code = org.company_code
    AND    mng.org_type_code = org.org_type_code
    AND    mng.org_code = org.org_code
    AND    mng.evaluation_operation_unit_code = org.evaluation_operation_unit_code;

    /* User's Eval Type :평가유형 */
    @readonly
    entity UserEvalType as projection on evalType;

}