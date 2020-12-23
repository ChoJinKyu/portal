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
        mst.budget_amount,
        mst.currency_code,
        mst.target_amount
	from approvalDtl.Md_Approval_Dtl dtl
	join moldMst.Md_Mst mst
	    on dtl.mold_id = mst.mold_id
	left join qtn.Md_Quotation qtn
		on dtl.mold_id = qtn.mold_id

}

