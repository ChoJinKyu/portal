using { dp as approvalMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MOLD_APPROVAL_DTL-model';


namespace dp;
@path : '/dp.OrderApprovalService'
service OrderApprovalService {

    entity ApprovalMasters as projection on approvalMst.Mold_Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Mold_Approval_Dtl;

}
