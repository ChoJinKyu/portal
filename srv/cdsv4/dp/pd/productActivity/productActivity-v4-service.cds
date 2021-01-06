using { dp as pdOperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as prodActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
using { dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
//using { dp as prodActivityTemplateType} from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE_TYPE-model';

namespace dp;
@path : '/dp.ProductActivityV4Service'

service ProductActivityV4Service {
    entity PdOperationOrg as projection on pdOperationOrg.Pd_Operation_Org_View;
    entity PdProdActivityTemplate as projection on prodActivityTemplate.Pd_Product_Activity_Template;
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
//    entity PdProdActivityTemplateType as projection on prodActivityTemplateType.Pd_Product_Activity_Template_Type;

    type PdProdActivityTemplateType : {
        tenant_id : String;
        company_code : String;
        org_type_code : String;
        org_code : String;
        product_activity_code : String;
        develope_event_code : String;
        sequence : String;
        product_activity_name : String;
        product_activity_english_name : String;
        milestone_flag : String;
        active_flag : String;
        update_user_id : String;
        system_update_dtm : String;
        crud_type_code : String;
        update_product_activity_code : String;
    }

    type PdProdActivityTemplateTypeArray : {
        pdProdActivityTemplateType : array of PdProdActivityTemplateType;
    }

    type OutType : {
        return_code : String(2);
        return_msg  : String(5000);
    };
    action PdProductActivitySaveProc(inputData : PdProdActivityTemplateTypeArray) returns array of OutType;

}
