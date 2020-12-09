using { cm as approvalMst } from '../../../../db/cds/cm/apprReq/CM_APPROVAL_MST-model';
using { cm as req } from '../../../../db/cds/cm/userMgr/CM_USER-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MD_APPROVAL_DTL-model';


using { dp as moldMstSpecView } from '../../../../db/cds/dp/moldMgt/DP_MD_MST_SPEC_VIEW-model';
using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MD_MST-model';

namespace dp;
@path : '/dp.MoldApprovalListService'
service MoldApprovalListService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;

    
    view Models as
    select distinct key a.tenant_id, key a.model
    from moldMst.Md_Mst a
    where a.model is not null;

    view PartNumbers as
    select distinct key a.tenant_id, key a.mold_number, a.spec_name, a.mold_item_type_name
    from moldMstSpecView.Md_Mst_Spec_View a
    where a.mold_number is not null;

    view CreateUsers as
    select distinct key a.tenant_id, key a.create_user_id, a.create_user_name
    from moldMstSpecView.Md_Mst_Spec_View a
    where a.create_user_id is not null;

    view Requestors as
    select key a.tenant_id, a.english_employee_name, a.user_id 
    from req.User a
    where  a.use_flag = true and  a.tenant_id = 'L1100' ;
}
