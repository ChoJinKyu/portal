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

using { cm as referer} from '../../../../../db/cds/cm/CM_REFERER-model'; 
using { cm as approver} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {cm.Hr_Department as Dept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

namespace dp;
@path : '/dp.MoldApprovalListService'
service MoldApprovalListService {

    entity ApprovalMasters as projection on approvalMst.Approval_Mst;
    entity ApprovalDetails as projection on approvalDtl.Md_Approval_Dtl;
    entity Approvals as projection on apps.Md_Approvals_View;
    
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


    /** approval Object */

   view AppMaster as 
        select 
            m.tenant_id             
            , m.approval_number        
            , m.legacy_approval_number 
            , m.company_code           
            , m.org_type_code          
            , m.org_code               
            , m.chain_code             
            , m.approval_type_code     
            , m.approval_title         
            , m.approval_contents      
            , m.approve_status_code    
            , m.requestor_empno        
            , m.request_date           
            , m.attch_group_number 
            , emp.email_id            
            , emp.user_local_name     
            , emp.user_korean_name    
            , emp.user_english_name   
            , emp.mobile_phone_number 
            , emp.office_phone_number 
            , emp.office_address      
            , emp.job_title           
            , emp.assign_type_code    
            , emp.assign_company_name 
            , emp.gender_code         
            , emp.nation_code         
            , emp.locale_code         
            , emp.department_id   
        from approvalMst.Approval_Mst m 
        join emp.Hr_Employee emp on m.requestor_empno = emp.employee_number ;

    // referer 저장 목록 조회 
    view Referers as 
    select 
	    rf.approval_number , 
	   key rf.referer_empno ,
        emp.user_local_name ||'/'|| emp.job_title||'/'||hr.department_local_name as referer_name : String(240)
    from referer.Referer rf 
    join emp.Hr_Employee emp on emp.employee_number = rf.referer_empno 
    join Dept hr on hr.department_id = emp.department_id 
    and hr.tenant_id = emp.tenant_id ;

    // 레퍼러 조회 팝업 
    view RefererSearch as 
    select 
        hr.tenant_id,
        hr.department_id,
        emp.user_local_name ||'/'|| emp.job_title||'/'||hr.department_local_name as s_referer_name : String(300), 
        emp.employee_number,
        emp.user_local_name ,
        emp.email_id 
    from emp.Hr_Employee  emp 
    join Dept hr on hr.department_id = emp.department_id and hr.tenant_id = emp.tenant_id ;

    // approvalline 저장목록 조회 
    view Approvers as
    select 
        ar.approval_number , 
        ar.approver_empno , 
        ar.approve_sequence , 
        ar.approver_type_code , 
        ar.approve_comment , 
        ar.approve_status_code , 
        ar.approve_date_time , 
        emp.user_korean_name ||'['|| emp.user_english_name||'] /'||hr.department_local_name as approver_name  : String(240)
    from approver.Approver ar 
    join emp.Hr_Employee  emp on emp.employee_number = ar.approver_empno 
    join  Dept hr on hr.department_id = emp.department_id 
    and hr.tenant_id = emp.tenant_id ;  
}
