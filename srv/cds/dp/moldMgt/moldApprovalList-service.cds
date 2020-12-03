using { dp as approvalMst } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_DTL-model';
using { dp as approvalsView } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVALS_VIEW-model';


namespace dp;
@path : '/dp.MoldApprovalListService'
service MoldApprovalListService {

    entity ApprovalMasters as projection on approvalMst.Md_Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity Approvals as projection on approvalsView.Md_Approvals_View;
    
}
