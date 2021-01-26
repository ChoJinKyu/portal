using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm as orgCodeLng } from '../../../../../db/cds/cm/CM_ORG_CODE_LNG-model';
using { sp.Sm_Supplier_Mst as supplier} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';
using { cm as cmDept } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model'; 
using { dp as moldSche } from '../../../../../db/cds/dp/md/DP_MD_SCHEDULE-model';
namespace dp;
/**
  * Mold Recepit Approval (금형 입고품의) 
 */
@path : '/dp.MoldRecepitApprovalService'
service MoldRecepitApprovalService { 

    // 테이블 목록 조회 
    view MoldRecepit as
	    select
            key	dtl.approval_number,
                mst.tenant_id,
                mst.mold_id,
                mst.model,
                mst.mold_number,
                mst.mold_sequence,
                mst.spec_name,
                mst.mold_item_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    where
                            l.group_code  = 'DP_MD_ITEM_TYPE'
                        and l.code        = mst.mold_item_type_code
                        and l.language_cd = 'KO'
                        and l.tenant_id   = mst.tenant_id
                ) as mold_item_type_code_nm : String(240) ,
                mst.currency_code ,
                cur.code_name as currency_code_nm : String(240) ,
                mst.receiving_amount,
                mst.book_currency_code, 
                mst.provisional_budget_amount, 
                mst.supplier_code,
                s1.supplier_local_name, 
                '[' || mst.supplier_code || '] ' || s1.supplier_local_name as  supplier_code_nm : String(240) ,
                mst.production_supplier_code , 
                '[' || mst.production_supplier_code || '] ' || s2.supplier_local_name as  production_supplier_code_nm : String(240),
                s2.supplier_local_name as production_supplier_local_name : String(240) ,
                mst.project_code, 
             /*   mst.acq_department_code, 
                dep.department_local_name as acq_department_code_nm : String(240) , */ 
                cast(ps.drawing_agreement_date as Date ) as drawing_consent_plan : Date , 
        		cast(rs.drawing_agreement_date as Date ) as drawing_consent_result : Date ,
        		cast(ps.first_production_date as Date ) as production_plan : Date , 
        		cast(rs.first_production_date as Date ) as production_result  : Date ,
                cast(ps.production_complete_date as Date ) as completion_plan : Date ,
                cast(rs.production_complete_date as Date ) as completion_result  : Date 
        from approvalDtl.Md_Approval_Dtl dtl
        join moldMst.Md_Mst mst on dtl.mold_id = mst.mold_id 
        join orgCodeLng.Org_Code_Lng as cur on mst.company_code = cur.org_code 
        and cur.group_code = 'DP_MD_LOCAL_CURRENCY' 
        and cur.tenant_id = mst.tenant_id 
        and cur.code = mst.currency_code 
        and cur.language_cd = 'KO'
        left join supplier s1 on s1.supplier_code = mst.supplier_code  and s1.tenant_id = mst.tenant_id 
        left join supplier s2 on s2.supplier_code = mst.production_supplier_code and s2.tenant_id = mst.tenant_id  
       /* left join cmDept.Hr_Department dep on dep.department_id =  mst.acq_department_code and dep.tenant_id = mst.tenant_id   */  
        left join moldSche.Md_Schedule ps on ps.mold_id = mst.mold_id and ps.mold_develope_date_type_code = 'P'
        left join moldSche.Md_Schedule rs on rs.mold_id = mst.mold_id and rs.mold_develope_date_type_code = 'R'
    ; 


}
