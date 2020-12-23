using {cm as approvalMst} from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using {dp as approvalDtl} from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using {cm as approver} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {dp as moldMst} from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using {cm as referer} from '../../../../../db/cds/cm/CM_REFERER-model';

namespace dp;
@path : '/dp.MoldApprovalV4Service'
service MoldApprovalV4Service { 
   /* entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity Approver        as projection on approver.Approver;
    entity MoldMasters     as projection on moldMst.Md_Mst;
    entity Referers        as projection on referer.Referer; */ 

    type saveReturnType {
        approvalMaster :  approvalMst.Approval_Mst ;
        approvalDetails : array of approvalDtl.Md_Approval_Dtl;
        approver : array of approver.Approver;
        moldMaster : array of moldMst.Md_Mst;
        referer : array of referer.Referer;
    }

    action saveMoldApproval ( inputData : saveReturnType ) returns saveReturnType;

}