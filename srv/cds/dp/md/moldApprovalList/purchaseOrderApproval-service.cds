using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_MST_APP_DTL_VIEW-model';

namespace dp;

@path : '/dp.PurchaseOrderApprovalService'
service PurchaseOrderApprovalService {
    entity PurchaseOrderItems as projection on approvalDtl.Md_Mst_App_Dtl_View;
}

