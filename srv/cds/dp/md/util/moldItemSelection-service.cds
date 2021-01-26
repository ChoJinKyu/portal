namespace dp.util;
using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { cm as codeDtl } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm as orgCodeLng } from '../../../../../db/cds/cm/CM_ORG_CODE_LNG-model'; 
using { sp.Sm_Supplier_Mst as supplier } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';
using { cm as cmDept } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model'; 
using { dp as moldSche } from '../../../../../db/cds/dp/md/DP_MD_SCHEDULE-model';

@path: '/dp.util.MoldItemSelectionService'
service MoldItemSelectionService { 

     // not in 대상 조회 
    view moldIdView as 
      select 
        key m2.tenant_id
        , key m2.approval_type_code 
        , dtl.mold_id 
      from  approvalMst.Approval_Mst m2  
      join approvalDtl.Md_Approval_Dtl dtl on m2.approval_number = dtl.approval_number 
      and m2.tenant_id = dtl.tenant_id
    ;

    /** 
      // 팝업 조회 용 
     */
    view MoldItemSelect as
        select
            key m.mold_id,
            key m.tenant_id,
            key m.company_code,
            key m.org_code,
                m.org_type_code,
                m.mold_number,
                m.mold_sequence,
                m.spec_name,
                m.model,
                m.asset_number,
                m.mold_item_type_code,
                m.mold_production_type_code,
                cl.code_name as mold_item_type_code_nm : String(240),
                m.first_production_date,
                m.production_complete_date,
                m.budget_amount,
                m.currency_code, 
                cur.code_name as currency_code_nm : String(240) ,
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
                dep.department_local_name as acq_department_code_nm : String(240) ,
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
                m.split_pay_type_code,
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
                m.purchasing_amount,
                m.use_department_code,
                m.local_create_dtm,
                m.local_update_dtm,
                m.create_user_id,
                m.update_user_id,
                m.system_create_dtm,
                m.system_update_dtm,
                m.supplier_code,
                s1.supplier_local_name, 
                m.mold_purchasing_type_code , 
                '[' || m.supplier_code || '] ' || s1.supplier_local_name as  supplier_code_nm : String(240) ,
                m.production_supplier_code, 
                '[' || m.production_supplier_code || '] ' || s2.supplier_local_name as  production_supplier_code_nm : String(240),
                s2.supplier_local_name as production_supplier_local_name : String(240) ,
                m.mold_progress_status_code ,
                cast(ps.drawing_agreement_date as Date ) as drawing_consent_plan : Date , 
        		cast(rs.drawing_agreement_date as Date ) as drawing_consent_result : Date ,
        		cast(ps.first_production_date as Date ) as production_plan : Date , 
        		cast(rs.first_production_date as Date ) as production_result  : Date ,
                cast(ps.production_complete_date as Date ) as completion_plan : Date ,
                cast(rs.production_complete_date as Date ) as completion_result  : Date 
        from moldMst.Md_Mst m 
        left join orgCodeLng.Org_Code_Lng as cur on m.company_code = cur.org_code 
                                    and cur.group_code = 'DP_MD_LOCAL_CURRENCY' 
                                    and cur.tenant_id = m.tenant_id 
                                    and cur.code = m.currency_code 
                                    and cur.language_cd = 'KO'
        left join supplier s1 on s1.supplier_code = m.supplier_code  and s1.tenant_id = m.tenant_id 
        left join supplier s2 on s2.supplier_code = m.production_supplier_code and s2.tenant_id = m.tenant_id  
        left join cmDept.Hr_Department dep on dep.department_id =  m.acq_department_code and dep.tenant_id = m.tenant_id 
        left join moldSche.Md_Schedule ps on ps.mold_id = m.mold_id and ps.mold_develope_date_type_code = 'P'
        left join moldSche.Md_Schedule rs on rs.mold_id = m.mold_id and rs.mold_develope_date_type_code = 'R' 
        left join codeLng.Code_Lng as cl on cl.code = m.mold_item_type_code 
                             and cl.group_code = 'DP_MD_ITEM_TYPE' 
                             and cl.language_cd = 'KO' 
                             and cl.tenant_id = m.tenant_id 
        ;

}