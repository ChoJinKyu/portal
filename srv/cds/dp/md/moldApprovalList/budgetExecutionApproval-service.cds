using {cm as approvalMst} from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using {dp as approvalDtl} from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using {cm as approver} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {dp as moldMst} from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using {cm as referer} from '../../../../../db/cds/cm/CM_REFERER-model';
using {cm as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm as orgPlant}from '../../../../../db/cds/cm/CM_ORG_PLANT-model';
using {cm as orgCompany} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Pur_Operation_Org as org } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model'; 
using { cm as purOrgTypeMap } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm.Hr_Department as Dept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

namespace dp;

@path : '/dp.BudgetExecutionApprovalService'
service BudgetExecutionApprovalService {

    view ItemBudgetExecution as
        select
            key dtl.approval_number,
                mst.tenant_id,
                mst.company_code,
                mst.org_type_code,
                mst.org_code,
                mst.mold_number,
                mst.mold_sequence,
                mst.mold_id,
                mst.mold_progress_status_code,
                mst.spec_name,
                mst.model,
                mst.asset_number,
                mst.mold_item_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    where
                            l.group_code  = 'DP_MD_ITEM_TYPE'
                        and l.code        = mst.mold_item_type_code
                        and l.language_cd = 'KO'
                        and l.tenant_id   = mst.tenant_id
                ) as mold_item_type_code_nm       : String(240),
                mst.mold_production_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    where
                            l.group_code  = 'DP_MD_PROD_TYPE'
                        and l.code        = mst.mold_production_type_code
                        and l.language_cd = 'KO'
                        and l.tenant_id   = mst.tenant_id
                ) as mold_production_type_code_nm : String(240),
                mst.mold_location_type_code,
                mst.first_production_date,
                mst.production_complete_date,
                mst.budget_amount,
                mst.currency_code,
                mst.target_amount,
                mst.mold_purchasing_type_code,
                mst.supplier_selection_remark,
                mst.order_confirmed_amount,
                mst.supplier_code,
                mst.purchasing_amount,
                mst.order_number,
                mst.investment_ecst_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    where
                            l.group_code  = 'DP_MD_BUDGET_TYPE'
                        and l.code        = mst.investment_ecst_type_code
                        and l.language_cd = 'KO'
                        and l.tenant_id   = mst.tenant_id
                ) as investment_ecst_type_code_nm : String(240),
                mst.project_code,
                mst.receiving_amount,
                mst.receiving_complete_date,
                mst.account_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    where
                            l.group_code  = 'DP_MD_ACCOUNT_NEW'
                        and l.code        = mst.account_code
                        and l.language_cd = 'KO'
                        and l.tenant_id   = mst.tenant_id
                ) as account_code_nm              : String(240),
                mst.accounting_department_code,
                mst.acq_department_code, 
                ( 
                    select d.department_local_name  
                    from Dept as d 
                    where d.tenant_id = mst.tenant_id 
                    and mst.acq_department_code = d.department_id
                ) as acq_department_code_nm    : String(240) , 
                mst.production_supplier_code,
                mst.remark,
                mst.mold_develope_request_type_code,
                mst.mold_develope_requestor_empno,
                mst.eco_number,
                mst.set_id,
                mst.ap_transfer_status_code,
                mst.market_type_code,
                mst.product_group_code,
                mst.product_group_type_code,
                mst.purchasing_contract_number,
                mst.lease_contract_number,
                mst.provisional_budget_amount,
                mst.book_currency_code,
                mst.budget_exrate_date,
                mst.budget_exrate,
                mst.split_pay_type_code,
                mst.prepay_rate,
                mst.progresspay_rate,
                mst.rpay_rate,
                mst.mold_sales_status_code,
                mst.pr_number,
                mst.import_company_code, 
                com.company_name as import_company_code_nm : String(240) ,
                mst.import_company_org_code,
                plant.org_name as import_company_org_code_nm : String(240) , 
                mst.inspection_date,
                mst.family_part_number_1,
                mst.family_part_number_2,
                mst.family_part_number_3,
                mst.family_part_number_4,
                mst.family_part_number_5,
                mst.mold_cost_analysis_type_code,
                mst.mold_type_code,
                mst.mold_mfger_code,
                mst.mold_developer_empno,
                mst.customer_asset_type_code,
                mst.asset_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    where
                            l.group_code  = 'DP_MD_ASSET_TYPE'
                        and l.code        = mst.asset_type_code
                        and l.language_cd = 'KO'
                        and l.tenant_id   = mst.tenant_id
                ) as asset_type_code_nm           : String(240),
                mst.asset_status_code,
                mst.scrap_date,
                mst.acq_date,
                mst.acq_amount,
                mst.use_department_code
        from approvalDtl.Md_Approval_Dtl dtl
        join moldMst.Md_Mst mst  on dtl.mold_id = mst.mold_id 
        left outer join orgCompany.Org_Company as com on com.company_code = mst.import_company_code 
        left outer join org as plant on mst.import_company_org_code = plant.org_code and mst.import_company_code = plant.company_code 
        and plant.org_type_code = (select ma.org_type_code from purOrgTypeMap.Pur_Org_Type_Mapping as ma where ma.tenant_id = dtl.tenant_id and ma.process_type_code = 'DP05') 
        
        ; 


}
