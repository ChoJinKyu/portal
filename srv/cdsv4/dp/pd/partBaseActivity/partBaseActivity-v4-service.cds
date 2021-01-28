//https://lgcommondev2-workspaces-ws-7bzzl-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.partBaseActivityV4Service/PdpartBaseActivitySaveProcCall
//using { dp as ProdActivity } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_-model';
//using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.partBaseActivityV4Service'

service partBaseActivityV4Service {
//    entity PdProdActivityView as projection on ProdActivity.Pd_Product_Activity__View;
//    entity PdProdActivity as projection on ProdActivity.Pd_Product_Activity_;
//    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;

    type PdpartBaseActivityType : {
        tenant_id : String;
        activity_code : String;
        description : String;
        active_flag : String;
        update_user_id : String;
        crud_type_code : String;
    };

    type PdpartBaseActivityLngType : {
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
        pdMst      : PdpartBaseActivityType;
        pdDtl      : array of PdpartBaseActivityLngType;
    }

    action PdpartBaseActivitySaveProc(inputData : ProcInputType) returns OutType;

}
