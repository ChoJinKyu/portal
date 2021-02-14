using { dp as asset } from '../../../../../db/cds/dp/md/DP_MD_ASSET-model';


namespace dp;
@path : '/dp.AssetListV4Service'
service AssetListV4Service { 

   entity AssetMasters as projection on asset.Md_Asset;

   type AssetMaster_v4 : {
        tenant_id               : String;
        mold_id                 : String;
        secondary_supplier_name : String;
        tertiary_supplier_name  : String;
        local_update_dtm        : DateTime;
        update_user_id          : String;
        system_update_dtm       : DateTime;
   };



    type data {
        assetData : array of AssetMaster_v4;
    }

    type resultMsg {
        messageCode : String;
        resultCode : Integer;
    }

    action updateListVendor ( inputData : data ) returns resultMsg;

}