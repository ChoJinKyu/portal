using { cm as approvalMst } from '../../../../db/cds/cm/apprReq/CM_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_DTL-model';
using { cm as approver } from '../../../../db/cds/cm/apprReq/CM_APPROVER-model';
using { dp as appDtlMoldMstView } from '../../../../db/cds/dp/moldMgt/DP_MD_MST_APP_DTL_VIEW-model';

namespace dp;
@path : '/dp.OrderApprovalService'
service OrderApprovalService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity Approver as projection on approver.Approver;
    entity AppDtlMoldMst as projection on appDtlMoldMstView.Md_Mst_App_Dtl_View;

}

