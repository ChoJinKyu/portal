using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { cm as req } from '../../../../../db/cds/cm/CM_USER-model';
using { cm as lng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm as com } from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using { cm as plt } from '../../../../../db/cds/cm/CM_ORG_PLANT-model';
using { cm as emp } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';
using { dp as apps } from '../../../../../db/cds/dp/md/DP_MD_APPROVALS_VIEW-model';



using { dp as moldMstSpecView } from '../../../../../db/cds/dp/md/DP_MD_MST_SPEC_VIEW-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';

using {cm as orgMapping} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm as Org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.MoldApprovalListService'
service MoldApprovalListService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity Approvals as projection on apps.Md_Approvals;
    
    view Divisions as
    select key a.tenant_id       
            ,key a.company_code  
            ,key a.org_type_code 
            ,key a.org_code         
                ,a.org_name          
                ,a.purchase_org_code 
                ,a.plant_code        
                ,a.affiliate_code    
                ,a.bizdivision_code  
                ,a.bizunit_code      
                ,a.au_code           
                ,a.hq_au_code        
                ,a.use_flag  
    from Org.Pur_Operation_Org a  
    left join orgMapping.Pur_Org_Type_Mapping b
    on a.tenant_id=b.tenant_id
    and a.org_type_code=b.org_type_code
    where b.process_type_code='DP05';
    
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
    select key a.tenant_id, key a.user_id, a.english_employee_name
    from req.User a
    where  a.use_flag = true;


}
