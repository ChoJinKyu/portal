//https://lgcommondev2-workspaces-ws-7bzzl-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.activityMappingV4Service/PdActivityMappingSaveProcCall
//using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
//using { dp as pdOperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
//using { dp as prodActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
//using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
//using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';
//using { dp as activityMappingType} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING_TYPE-model';

namespace dp;
@path : '/dp.ActivityMappingV4Service'

service ActivityMappingV4Service {
//    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
//    entity PdOperationOrg as projection on pdOperationOrg.Pd_Operation_Org_View;
//    entity PdProdActivityTemplate as projection on prodActivityTemplate.Pd_Product_Activity_Template;
//    entity PdPartActivityTemplate as projection on partActivityTemplate.Pd_Part_Activity_Template;
//    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
//    entity PdActivityMappingType as projection on activityMappingType.Pd_Activity_Mapping_Type;

    type PdActivityMappingType : {
        tenant_id : String;
        company_code : String;
        org_type_code : String;
        org_code : String;
        activity_code : String;
        product_activity_code : String;
        activity_dependency_code : String;
        active_flag : String;
        update_user_id : String;
        system_update_dtm : String;
        crud_type_code : String;
        update_activity_code : String;
        update_product_activity_code : String;
    }

    type OutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };
    action PdActivityMappingSaveProc(inputData : array of PdActivityMappingType) returns array of OutType;

}