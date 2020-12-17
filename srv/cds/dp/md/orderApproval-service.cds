using { cm as approvalMst } from '../../../../db/cds/cm/apprReq/CM_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { cm as approver } from '../../../../db/cds/cm/apprReq/CM_APPROVER-model';
using { cm as referer } from '../../../../db/cds/cm/apprReq/CM_REFERER-model';
using { dp as moldMst } from '../../../../db/cds/dp/md/DP_MD_MST-model';

namespace dp;
@path : '/dp.OrderApprovalService'
service OrderApprovalService {
    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity Approvers as projection on approver.Approver;
    entity Referers as projection on referer.Referer;
    entity MoldMasters as projection on moldMst.Md_Mst;
}
