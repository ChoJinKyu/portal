namespace dp.util;
using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MD_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_DTL-model';
@path: '/dp.util.MoldItemSelectionService'
service MoldItemSelectionService {
    entity MoldMasters as projection on moldMst.Md_Mst; 
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;


}