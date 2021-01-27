using {dp as approvalDtl} from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { dp as qtn } from '../../../../../db/cds/dp/md/DP_MD_QUOTATION-model';
using {dp as moldMst} from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using {cm as referer} from '../../../../../db/cds/cm/CM_REFERER-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { sp.Sm_Supplier_Mst as supplier} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

namespace dp;
@path : '/dp.ParticipatingSupplierSelectionApprovalService'
service ParticipatingSupplierSelectionApprovalService {
    
    view ParticipatingSupplier as
    select
    	key dtl.approval_number,
        key mst.tenant_id,
        mst.company_code,
        mst.org_type_code,
        mst.org_code,
        mst.mold_number,
        mst.mold_sequence,
        mst.model,
        key mst.mold_id,
        mst.spec_name,
        mst.mold_item_type_code,
        (
            select l.code_name from codeLng.Code_Lng l
            where
                    l.group_code  = 'DP_MD_ITEM_TYPE'
                and l.code        = mst.mold_item_type_code
                and l.language_cd = 'KO'
                and l.tenant_id   = mst.tenant_id
        ) as mold_item_type_code_nm : String(240),
        mst.book_currency_code,
        mst.provisional_budget_amount,
        mst.budget_amount,
        mst.currency_code,
        mst.target_amount,
        '[' || qtn_1.supplier_code || '] ' || s1.supplier_local_name as  supplier_code_nm_1 : String(240),
        '[' || qtn_2.supplier_code || '] ' || s2.supplier_local_name as  supplier_code_nm_2 : String(240),
        '[' || qtn_3.supplier_code || '] ' || s3.supplier_local_name as  supplier_code_nm_3 : String(240),
        '[' || qtn_4.supplier_code || '] ' || s4.supplier_local_name as  supplier_code_nm_4 : String(240),
        '[' || qtn_5.supplier_code || '] ' || s5.supplier_local_name as  supplier_code_nm_5 : String(240),
        '[' || qtn_6.supplier_code || '] ' || s6.supplier_local_name as  supplier_code_nm_6 : String(240),
        '[' || qtn_7.supplier_code || '] ' || s7.supplier_local_name as  supplier_code_nm_7 : String(240),
        '[' || qtn_8.supplier_code || '] ' || s8.supplier_local_name as  supplier_code_nm_8 : String(240),
        '[' || qtn_9.supplier_code || '] ' || s9.supplier_local_name as  supplier_code_nm_9 : String(240),
        '[' || qtn_10.supplier_code || '] ' || s10.supplier_local_name as  supplier_code_nm_10 : String(240),
        '[' || qtn_11.supplier_code || '] ' || s11.supplier_local_name as  supplier_code_nm_11 : String(240),
        '[' || qtn_12.supplier_code || '] ' || s12.supplier_local_name as  supplier_code_nm_12 : String(240),
        qtn_1.supplier_code as supplier_code_1 : String(20),
        qtn_2.supplier_code as supplier_code_2 : String(20),
        qtn_3.supplier_code as supplier_code_3 : String(20),
        qtn_4.supplier_code as supplier_code_4 : String(20),
        qtn_5.supplier_code as supplier_code_5 : String(20),
        qtn_6.supplier_code as supplier_code_6 : String(20),
        qtn_7.supplier_code as supplier_code_7 : String(20),
        qtn_8.supplier_code as supplier_code_8 : String(20),
        qtn_9.supplier_code as supplier_code_9 : String(20),
        qtn_10.supplier_code as supplier_code_10 : String(20),
        qtn_11.supplier_code as supplier_code_11 : String(20),
        qtn_12.supplier_code as supplier_code_12 : String(20),
        qtn_1.sequence as sequence_1 : String(5),
        qtn_2.sequence as sequence_2 : String(5),
        qtn_3.sequence as sequence_3 : String(5),
        qtn_4.sequence as sequence_4 : String(5),
        qtn_5.sequence as sequence_5 : String(5),
        qtn_6.sequence as sequence_6 : String(5),
        qtn_7.sequence as sequence_7 : String(5),
        qtn_8.sequence as sequence_8 : String(5),
        qtn_9.sequence as sequence_9 : String(5),
        qtn_10.sequence as sequence_10 : String(5),
        qtn_11.sequence as sequence_11 : String(5),
        qtn_12.sequence as sequence_12 : String(5)
	from approvalDtl.Md_Approval_Dtl dtl
	join moldMst.Md_Mst mst on dtl.mold_id = mst.mold_id
    left JOIN qtn.Md_Quotation AS qtn_1 ON dtl.mold_id = qtn_1.mold_id and qtn_1.sequence = 1 and dtl.approval_number = qtn_1.approval_number
	left JOIN qtn.Md_Quotation AS qtn_2 ON dtl.mold_id = qtn_2.mold_id and qtn_2.sequence = 2 and dtl.approval_number = qtn_2.approval_number
	left JOIN qtn.Md_Quotation AS qtn_3 ON dtl.mold_id = qtn_3.mold_id and qtn_3.sequence = 3 and dtl.approval_number = qtn_3.approval_number
	left JOIN qtn.Md_Quotation AS qtn_4 ON dtl.mold_id = qtn_4.mold_id and qtn_4.sequence = 4 and dtl.approval_number = qtn_4.approval_number
	left JOIN qtn.Md_Quotation AS qtn_5 ON dtl.mold_id = qtn_5.mold_id and qtn_5.sequence = 5 and dtl.approval_number = qtn_5.approval_number
	left JOIN qtn.Md_Quotation AS qtn_6 ON dtl.mold_id = qtn_6.mold_id and qtn_6.sequence = 6 and dtl.approval_number = qtn_6.approval_number
	left JOIN qtn.Md_Quotation AS qtn_7 ON dtl.mold_id = qtn_7.mold_id and qtn_7.sequence = 7 and dtl.approval_number = qtn_7.approval_number
	left JOIN qtn.Md_Quotation AS qtn_8 ON dtl.mold_id = qtn_8.mold_id and qtn_8.sequence = 8 and dtl.approval_number = qtn_8.approval_number
	left JOIN qtn.Md_Quotation AS qtn_9 ON dtl.mold_id = qtn_9.mold_id and qtn_9.sequence = 9 and dtl.approval_number = qtn_9.approval_number
	left JOIN qtn.Md_Quotation AS qtn_10 ON dtl.mold_id = qtn_10.mold_id and qtn_10.sequence = 10 and dtl.approval_number = qtn_10.approval_number
	left JOIN qtn.Md_Quotation AS qtn_11 ON dtl.mold_id = qtn_11.mold_id and qtn_11.sequence = 11 and dtl.approval_number = qtn_11.approval_number
	left JOIN qtn.Md_Quotation AS qtn_12 ON dtl.mold_id = qtn_12.mold_id and qtn_12.sequence = 12 and dtl.approval_number = qtn_12.approval_number
    left join supplier s1 on s1.supplier_code = qtn_1.supplier_code  and s1.tenant_id = mst.tenant_id
	left join supplier s2 on s2.supplier_code = qtn_2.supplier_code  and s2.tenant_id = mst.tenant_id 
	left join supplier s3 on s3.supplier_code = qtn_3.supplier_code  and s3.tenant_id = mst.tenant_id 
	left join supplier s4 on s4.supplier_code = qtn_4.supplier_code  and s4.tenant_id = mst.tenant_id 
	left join supplier s5 on s5.supplier_code = qtn_5.supplier_code  and s5.tenant_id = mst.tenant_id 
	left join supplier s6 on s6.supplier_code = qtn_6.supplier_code  and s6.tenant_id = mst.tenant_id 
	left join supplier s7 on s7.supplier_code = qtn_7.supplier_code  and s7.tenant_id = mst.tenant_id 
	left join supplier s8 on s8.supplier_code = qtn_8.supplier_code  and s8.tenant_id = mst.tenant_id
	left join supplier s9 on s9.supplier_code = qtn_9.supplier_code  and s9.tenant_id = mst.tenant_id 
	left join supplier s10 on s10.supplier_code = qtn_10.supplier_code  and s10.tenant_id = mst.tenant_id 
	left join supplier s11 on s11.supplier_code = qtn_11.supplier_code  and s11.tenant_id = mst.tenant_id 
	left join supplier s12 on s12.supplier_code = qtn_12.supplier_code  and s12.tenant_id = mst.tenant_id; 
}