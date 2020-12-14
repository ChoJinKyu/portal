namespace dp.util;
using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MD_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_DTL-model';
@path: '/dp.util.MoldItemSelectionService'
service MoldItemSelectionService {
    entity MoldMasters as projection on moldMst.Md_Mst; 
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;

    view MoldItemSelect as 
    select 
        m.tenant_id,
        m.company_code,
        m.org_type_code,
        m.org_code,
        m.mold_number,
        m.mold_sequence,
        m.mold_id,
        m.spec_name,
        m.model,
        m.asset_number,
        m.mold_item_type_code,
        m.mold_production_type_code,
        m.first_production_date,
        m.production_complete_date,
        m.budget_amount,
        m.currency_code,
        m.target_amount,
        m.order_confirmed_amount,
        m.order_number,
        m.investment_ecst_type_code,
        m.project_code,
        m.receiving_amount,
        m.receiving_complete_date,
        m.account_code,
        m.accounting_department_code,
        m.acq_department_code,
        m.remark,
        m.eco_number,
        m.set_id,
        m.market_type_code,
        m.product_group_code,
        m.product_group_type_code,
        m.provisional_budget_amount,
        m.book_currency_code,
        m.budget_exrate_date,
        m.budget_exrate,
        m.split_pay_flag,
        m.prepay_rate,
        m.progresspay_rate,
        m.rpay_rate,
        m.pr_number,
        m.import_company_code,
        m.import_company_org_code,
        m.inspection_date,
        m.family_part_number_1,
        m.family_part_number_2,
        m.family_part_number_3,
        m.family_part_number_4,
        m.family_part_number_5,
        m.mold_type_code,
        m.asset_type_code,
        m.asset_status_code,
        m.scrap_date,
        m.acq_date,
        m.acq_amount,
        m.use_department_code,
        m.local_create_dtm,
        m.local_update_dtm,
        m.create_user_id,
        m.update_user_id,
        m.system_create_dtm,
        m.system_update_dtm,
        m.supplier_code
    from moldMst.Md_Mst m 
    where  m.mold_id not in (
        select d.mold_id from approvalDtl.Md_Approval_Dtl d
    );


}