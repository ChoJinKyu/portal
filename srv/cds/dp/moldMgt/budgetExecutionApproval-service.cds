using { dp as approvalMst } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_DTL-model';
using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MD_MST-model';


namespace dp;
@path : '/dp.BudgetExecutionApprovalService'
service BudgetExecutionApprovalService {

    entity ApprovalMasters as projection on approvalMst.Md_Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity MoldMasters as projection on moldMst.Md_Mst;

}

