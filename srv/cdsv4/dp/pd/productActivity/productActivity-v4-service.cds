//https://lgcommondev2-workspaces-ws-7bzzl-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.productActivityV4Service/PdProductActivitySaveProcCall
//using { dp as ProdActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
//using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.productActivityV4Service'

service ProductActivityV4Service {
//    entity PdProdActivityTemplateView as projection on ProdActivityTemplate.Pd_Product_Activity_Template_View;
//    entity PdProdActivityTemplate as projection on ProdActivityTemplate.Pd_Product_Activity_Template;
//    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;

    type PdProductActivityTemplateType : {
        tenant_id : String;
        product_activity_code : String;
        description : String;
        active_flag : String;
        update_user_id : String;
        crud_type_code : String;
    };

    type PdProductActivityTemplateLngType : {
        tenant_id : String;
        product_activity_code : String;
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
        pdMst      : array of PdProductActivityTemplateType;
        pdDtl      : array of PdProductActivityTemplateLngType;
    }

    action PdProductActivitySaveProc(inputData : array of ProcInputType) returns array of OutType;

}
