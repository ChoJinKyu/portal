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
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=1) as supplier_code_1 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=2) as supplier_code_2 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=3) as supplier_code_3 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=4) as supplier_code_4 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=5) as supplier_code_5 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=6) as supplier_code_6 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=7) as supplier_code_7 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=8) as supplier_code_8 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=9) as supplier_code_9 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=10) as supplier_code_10 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=11) as supplier_code_11 : String(240),
        (select a.supplier_code from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=12) as supplier_code_12 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=1) as sequence_1 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=2) as sequence_2 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=3) as sequence_3 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=4) as sequence_4 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=5) as sequence_5 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=6) as sequence_6 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=7) as sequence_7 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=8) as sequence_8 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=9) as sequence_9 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=10) as sequence_10 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=11) as sequence_11 : String(240),
        (select a.sequence from qtn.Md_Quotation a where a.mold_id = mst.mold_id and a.sequence=12) as sequence_12 : String(240)
	from approvalDtl.Md_Approval_Dtl dtl
	join moldMst.Md_Mst mst on dtl.mold_id = mst.mold_id;
   
}