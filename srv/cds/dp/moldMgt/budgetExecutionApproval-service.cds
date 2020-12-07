using { cm as approvalMst } from '../../../../db/cds/cm/apprReq/CM_APPROVAL_MST-model'; 
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_DTL-model';
using { cm as approver } from '../../../../db/cds/cm/apprReq/CM_APPROVER-model';
using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MD_MST-model';


namespace dp;
@path : '/dp.BudgetExecutionApprovalService'
service BudgetExecutionApprovalService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl; 
    entity Approver as projection on approver.Approver;
    entity MoldMasters as projection on moldMst.Md_Mst;

    view ItemBudgetExecution as 
    select key dtl.approval_number  ,  
            
            mst.tenant_id,
            mst.company_code,
            mst.org_type_code,
            mst.org_code,
            mst.mold_number,
            mst.mold_sequence,
            mst.mold_id,
            mst.spec_name,
            mst.model,
            mst.asset_number,
            mst.mold_item_type_code,
            mst.mold_production_type_code,
            mst.first_production_date,
            mst.production_complete_date,
            mst.budget_amount,
            mst.currency_code,
            mst.target_amount,
            mst.order_confirmed_amount,
            mst.order_number,
            mst.investment_ecst_type_code,
            mst.project_code,
            mst.receiving_amount,
            mst.receiving_complete_date,
            mst.account_code,
            mst.accounting_department_code,
            mst.acq_department_code,
            mst.remark,
            mst.eco_number,
            mst.set_id,
            mst.market_type_code,
            mst.product_group_code,
            mst.product_group_type_code,
            mst.provisional_budget_amount,
            mst.book_currency_code,
            mst.budget_exrate_date,
            mst.budget_exrate,
            mst.split_pay_flag,
            mst.prepay_rate,
            mst.progresspay_rate,
            mst.rpay_rate,
            mst.pr_number,
            mst.import_company_code,
            mst.import_company_org_code,
            mst.inspection_date,
            mst.family_part_number_1,
            mst.family_part_number_2,
            mst.family_part_number_3,
            mst.family_part_number_4,
            mst.family_part_number_5,
            mst.mold_type_code,
            mst.asset_type_code,
            mst.asset_status_code,
            mst.scrap_date,
            mst.acq_date,
            mst.acq_amount,
            mst.use_department_code,
            mst.local_create_dtm,
            mst.local_update_dtm,
            mst.create_user_id,
            mst.update_user_id,
            mst.system_create_dtm,
            mst.system_update_dtm
    from approvalDtl.Md_Approval_Dtl dtl 
    join moldMst.Md_Mst mst on dtl.mold_id = mst.mold_id;       
       

}

