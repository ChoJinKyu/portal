using { cm as approvalMst } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using { cm as req } from '../../../../../db/cds/cm/CM_USER-model';
using { cm as lng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm as com } from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using { cm as plt } from '../../../../../db/cds/cm/CM_ORG_PLANT-model';
using { cm as emp } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { dp as approvalDtl } from '../../../../../db/cds/dp/md/DP_MD_APPROVAL_DTL-model';


using { dp as moldMstSpecView } from '../../../../../db/cds/dp/md/DP_MD_MST_SPEC_VIEW-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';

using {cm as orgMapping} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm as Org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.MoldApprovalListService'
service MoldApprovalListService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    

    view Approvals as
    select 
        key a.approval_number
        ,key a.tenant_id
        ,a.approval_type_code
        ,d.code_name as approval_type : String(240)
        ,a.approval_title
        ,e.company_name 
        ,f.plant_name as org_name
        ,c.company_code
        ,c.org_type_code
        ,c.org_code
        ,c.model
        ,c.mold_id
        ,c.mold_number
        ,a.requestor_empno
        ,g.user_english_name
        ,g.user_korean_name
        ,a.request_date
        ,a.approve_status_code
        ,h.code_name as approve_status : String(240)
        ,a.approval_contents
    from approvalMst.Approval_Mst a
    join (select approval_number, max(mold_id) as mold_id from approvalDtl.Md_Approval_Dtl group by approval_number) b 
        on a.approval_number = b.approval_number
    join moldMst.Md_Mst c on b.mold_id = c.mold_id
    join (select 
            l.code, l.code_name, l.tenant_id
            from lng.Code_Lng l
            where l.group_code='DP_MD_APPROVAL_TYPE' and l.language_cd='KO') d 
    on d.code = a.approval_type_code and d.tenant_id = a.tenant_id
    join com.Org_Company e on e.company_code = c.company_code
    join plt.Org_Plant f on f.au_code = c.org_code and f.company_code=c.company_code
    join emp.Hr_Employee g on g.employee_number = a.requestor_empno and g.tenant_id = a.tenant_id
    join (select 
            l.code, l.code_name, l.tenant_id
            from lng.Code_Lng l 
            where l.group_code='CM_APPROVE_STATUS' and l.language_cd='KO') h   
    on h.code = a.approve_status_code and h.tenant_id = a.tenant_id
    order by a.approval_number asc;
    

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
