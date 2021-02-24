//https://lgcommondev2-workspaces-ws-7bzzl-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.partActivityV4Service/PdpartActivitySaveProcCall
using { dp.Pd_Part_Base_Activity_View as Dp_Pd_Part_Base_Activity_View} from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY_VIEW-model';	
using { dp.Pd_Part_Activity_Template as Dp_Pd_Part_Activity_Template} from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';	
//using { dp as PartActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
//using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
//using {dp as partBaseActivity} from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY-model';

namespace dp;
@path : '/dp.partActivityV4Service'

service partActivityV4Service {
//    entity PdProdActivityTemplateView as projection on ProdActivityTemplate.Pd_Product_Activity_Template_View;
//    entity PdProdActivityTemplate as projection on ProdActivityTemplate.Pd_Product_Activity_Template;
//    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
//    entity PartBaseActivity as projection on partBaseActivity.Pd_Select_An_Activity_View;

    type PdpartActivityTemplateType : {
        tenant_id : String;
        company_code : String;
        org_code : String;
        part_project_type_code : String;
        activity_code : String;
        sequence : String;
        develope_event_code : String;
        actual_role_code : String;
        activity_complete_type_code : String;
        job_type_code : String;
        attachment_mandatory_flag : String;
        approve_mandatory_flag : String;
        active_flag : String;
        update_user_id : String;
        crud_type_code : String;
    };

    type OutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };

    type ProcInputType : {
        crud_type  : String(1);
        pdMst      : PdpartActivityTemplateType;
    }

    action PdpartActivitySaveProc(inputData : ProcInputType) returns OutType;

    view SelectAnActivityView (
    company_code : String(40),
    org_code : String(40),
    part_project_type_code : String(40),
    activity_name : String(100)
    ) as 
    select key pa.tenant_id,
	       key pa.activity_code,
	           pa.activity_name,
	           pa.active_flag,
	           pa.active_flag_val
    from   Dp_Pd_Part_Base_Activity_View pa
    where  pa.tenant_id = 'L2101'
    and	   not exists (select * from Dp_Pd_Part_Activity_Template where tenant_id = pa.tenant_id and company_code = :company_code and org_code = :org_code and part_project_type_code = :part_project_type_code and activity_code = pa.activity_code)
    and    pa.activity_name like '%' || :activity_name || '%';

}