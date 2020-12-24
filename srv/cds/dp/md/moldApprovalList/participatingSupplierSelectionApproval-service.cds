using {cm as approvalMst} from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using {dp as approvalDtl} from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using {cm as approver} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {dp as moldMst} from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using {cm as referer} from '../../../../../db/cds/cm/CM_REFERER-model';
using {cm as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { dp as qtn } from '../../../../../db/cds/dp/md/DP_MD_QUOTATION-model';

namespace dp;
@path : '/dp.ParticipatingSupplierSelectionApprovalService'
service ParticipatingSupplierSelectionApprovalService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl; 
    entity Approver as projection on approver.Approver;
    entity MoldMasters     as projection on moldMst.Md_Mst;
    entity Referers        as projection on referer.Referer; 
    entity quotation as projection on qtn.Md_Quotation;

    view ParticipatingSupplier as
    select
    	key dtl.approval_number,
        mst.tenant_id,
        mst.company_code,
        mst.org_type_code,
        mst.org_code,
        mst.mold_number,
        mst.mold_sequence,
        mst.model,
        mst.mold_id,
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
        qtn_1.supplier_code as supplier_code_1,
        qtn_2.supplier_code as supplier_code_2,
        qtn_3.supplier_code as supplier_code_3,
        qtn_4.supplier_code as supplier_code_4,
        qtn_5.supplier_code as supplier_code_5,
        qtn_6.supplier_code as supplier_code_6,
        qtn_7.supplier_code as supplier_code_7,
        qtn_8.supplier_code as supplier_code_8,
        qtn_9.supplier_code as supplier_code_9,
        qtn_10.supplier_code as supplier_code_10,
        qtn_11.supplier_code as supplier_code_11,
        qtn_12.supplier_code as supplier_code_12,
        qtn_1.sequence as sequence_1,
        qtn_2.sequence as sequence_2,
        qtn_3.sequence as sequence_3,
        qtn_4.sequence as sequence_4,
        qtn_5.sequence as sequence_5,
        qtn_6.sequence as sequence_6,
        qtn_7.sequence as sequence_7,
        qtn_8.sequence as sequence_8,
        qtn_9.sequence as sequence_9,
        qtn_10.sequence as sequence_10,
        qtn_11.sequence as sequence_11,
        qtn_12.sequence as sequence_12
	from approvalDtl.Md_Approval_Dtl dtl
	join moldMst.Md_Mst mst
	    on dtl.mold_id = mst.mold_id
	left join qtn.Md_Quotation qtn_1
		on dtl.mold_id = qtn_1.mold_id
    left join qtn.Md_Quotation qtn_2
		on dtl.mold_id = qtn_2.mold_id
    left join qtn.Md_Quotation qtn_3
		on dtl.mold_id = qtn_3.mold_id
    left join qtn.Md_Quotation qtn_4
		on dtl.mold_id = qtn_4.mold_id
    left join qtn.Md_Quotation qtn_5
		on dtl.mold_id = qtn_5.mold_id
    left join qtn.Md_Quotation qtn_6
		on dtl.mold_id = qtn_6.mold_id
    left join qtn.Md_Quotation qtn_7
		on dtl.mold_id = qtn_7.mold_id
    left join qtn.Md_Quotation qtn_8
		on dtl.mold_id = qtn_8.mold_id
    left join qtn.Md_Quotation qtn_9
		on dtl.mold_id = qtn_9.mold_id
    left join qtn.Md_Quotation qtn_10
		on dtl.mold_id = qtn_10.mold_id
    left join qtn.Md_Quotation qtn_11
		on dtl.mold_id = qtn_11.mold_id
    left join qtn.Md_Quotation qtn_12
		on dtl.mold_id = qtn_12.mold_id
}