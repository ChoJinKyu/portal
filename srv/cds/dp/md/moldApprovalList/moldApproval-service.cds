using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { cm as approver } from '../../../../../db/cds/cm/CM_APPROVER-model';
using { cm as referer } from '../../../../../db/cds/cm/CM_REFERER-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { dp as qtn } from '../../../../../db/cds/dp/md/DP_MD_QUOTATION-model';

/**
 * @description : 품의서 내용 저장하는 entity 모음 
 * @date        : 2020.12.24 
 * @author      : jinseon.lee 
 */

namespace dp;
@path : '/dp.MoldApprovalService'
service MoldApprovalService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity Approvers as projection on approver.Approver;
    entity Referers as projection on referer.Referer;
    entity MoldMasters as projection on moldMst.Md_Mst;
    entity Quotation as projection on qtn.Md_Quotation;

}