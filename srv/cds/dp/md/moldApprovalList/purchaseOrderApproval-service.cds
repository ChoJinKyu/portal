using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_MST_APP_DTL_VIEW-model';
using { cm as approver } from '../../../../../db/cds/cm/CM_APPROVER-model';
using { cm as referer } from '../../../../../db/cds/cm/CM_REFERER-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_PARTIAL_PAYMENT-model';

namespace dp;
@path : '/dp.PurchaseOrderApprovalService'
service PurchaseOrderApprovalService {
    /*entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Mst_App_Dtl_View;
    entity Approvers as projection on approver.Approver;
    entity Referers as projection on referer.Referer;
    entity MoldMasters as projection on moldMst.Md_Mst;*/

    entity PurchaseOrderItems as projection on approvalDtl.Md_Mst_App_Dtl_View;
}

