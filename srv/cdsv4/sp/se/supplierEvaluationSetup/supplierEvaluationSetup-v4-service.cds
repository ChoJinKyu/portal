using { sp.Se_Copy_T as copyT } from '../../../../../db/cds/sp/se/SP_SE_COPY_T-model';
using { cm.Org_Code_Lng as maxLvl } from '../../../../../db/cds/cm/CM_ORG_CODE_LNG-model';

namespace sp;
@path : '/sp.supEvalSetupV4Service'
service SupEvalSetupV4Service { 
    
    /* Vendor Pool Level Chip Set */
    view VpLevelView as
        select Key lvl.tenant_id,
               Key lvl.org_code,
               Key lvl.code vp_operation_unit_code,
               Key cp.copy_no level_no,
               cp.copy_no || ' Level' level_name : String(10) 
        from   maxLvl lvl,
               copyT cp
        where  to_number(lvl.code_name) >= cp.copy_no
        and    lvl.group_code = 'VP_VENDOR_POOL_MAX_LEVEL'
        and    lvl.language_cd = 'KO'
        ;

    view VpLevelChipView (tenant_id: String, org_code: String, op_unit_code: String) as
        select distinct 
               Key level_no,
               level_name
        from   VpLevelView
        where  tenant_id = :tenant_id
        and    org_code = :org_code
        and    instr(:op_unit_code, vp_operation_unit_code) > 0
        and    level_no <= (select min(v1.l_no1) as l_no : String(10)
                            from   (select v.tenant_id,
                                           v.org_code,
                                           v.vp_operation_unit_code,
                                           max(v.level_no) as l_no1: String(10)
                                    from   VpLevelView v
                                    where  v.tenant_id = :tenant_id
                                    and    v.org_code = :org_code
                                    and    instr(:op_unit_code, v.vp_operation_unit_code) > 0
                                    group by v.vp_operation_unit_code,
                                             v.tenant_id,
                                             v.org_code) as v1)
        ;
        
    
    type operationUnitMst : {
        tenant_id: String(5); 
        company_code: String(10); 
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        evaluation_operation_unit_name: String(50);
        distrb_score_eng_flag: Boolean;
        evaluation_request_mode_code: String(30);
        evaluation_request_approval_flag: Boolean;
        operation_plan_flag: Boolean;
        eval_apply_vendor_pool_lvl_no: Decimal;
        use_flag: Boolean;
    };

    type vpOperationUnit : {
        vendor_pool_operation_unit_code: String(30);
    };

    type mangers : {
        transaction_code: String(1);
        tenant_id: String(5);
        company_code: String(10);
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        evaluation_op_unt_person_empno: String(30);
        evaluation_execute_role_code: String(30);
    };

    type quantitative : {
        transaction_code: String(1);
        tenant_id: String(5);
        company_code: String(10);
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        qttive_item_code: String(15);
        qttive_item_name: String(240);
        qttive_item_uom_code: String(30);
        qttive_item_measure_mode_code: String(50);
        qttive_item_desc: String(1000);
        sort_sequence: Decimal;
    };

    type rtnMsg : {
        return_code: String(2);
 	    return_msg: String(1000);
    } 

    action SaveEvaluationSetup1Proc (OperationUnitMst : array of operationUnitMst,
                                     VpOperationUnit : array of vpOperationUnit,
                                     Mangers : array of mangers,
                                     Quantitative : array of quantitative,
                                     user_id : String(30)) returns array of rtnMsg;

    type evalType : {
        tenant_id: String(10);
        company_code: String(10);
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        evaluation_type_code: String(30);
        evaluation_type_name: String(50);
        evaluation_type_distrb_score_rate : Decimal;
        use_flag: Boolean;
    };

    type evalGrade : {
        tansaction_code: String(1);
        tenant_id: String(10);
        company_code: String(10);
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        evaluation_type_code: String(30);
        evaluation_grade: String(10);
        evaluation_grade_start_score: Decimal(6,2);
        evaluation_grade_end_score: Decimal(6,2);
        inp_apply_code: String(30);
    };

    action SaveEvaluationSetup2Proc (EvalType : array of evalType,
                                     EvalGrade : array of evalGrade,
                                     user_id : String(30)) returns array of rtnMsg;
                                     
}