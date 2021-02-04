//https://lgcommondev2-workspaces-ws-7bzzl-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.partActivityV4Service/PdpartActivitySaveProcCall
//using { dp as PartActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
//using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.partActivityV4Service'

service partActivityV4Service {
//    entity PdProdActivityTemplateView as projection on ProdActivityTemplate.Pd_Product_Activity_Template_View;
//    entity PdProdActivityTemplate as projection on ProdActivityTemplate.Pd_Product_Activity_Template;
//    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;

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

    type PdPartBaseActivityLng : {
        tenant_id : String;
        activity_code : String;
        language_cd : String;
        code_name : String;
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
        pdDtl      : array of PdPartBaseActivityLng;
    }

    action PdpartActivitySaveProc(inputData : ProcInputType) returns OutType;

}