using { dp as approvalMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MOLD_APPROVAL_DTL-model';

using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST-model';
using { cm as company} from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using { cm as plant} from '../../../../db/cds/cm/orgMgr/CM_ORG_PLANT-model';


namespace dp;
@path : '/dp.OrderApprovalService'
service OrderApprovalService {

    entity ApprovalMasters as projection on approvalMst.Mold_Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Mold_Approval_Dtl;
    
    view Approvals as
    select distinct key a.approval_number
        ,a.approval_type_code
        ,c.company_name
        ,p.plant_name
        ,a.approval_title
        ,a.requestor_empno
        ,a.request_date
        ,a.approve_status_code
    from approvalMst.Mold_Approval_Mst a
    inner join approvalDtl.Mold_Approval_Dtl d 
    on a.approval_number = d.approval_number
    inner join moldMst.Mold_Mst m 
    on m.mold_id = d.mold_id 
    inner join company.Org_Company c 
    on c.company_code = m.company_code 
    inner join plant.Org_Plant p 
    on p.company_code = m.company_code
    where a.approval_number is not null;

}
