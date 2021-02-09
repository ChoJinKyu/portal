using { dp as item } from  '../../../../../db/cds/dp/md/DP_MD_REPAIR_ITEM-model';

namespace dp;
@path : '/dp.RrMgtListV4Service' 
service RrMgtListV4Service { 

    entity RepairItem as projection on item.Md_Repair_Item; // 저장 엔터티 

    // 파라미터 타입 
    type RepairItem_v4 {
        repair_request_number     : String;
        mold_id                   : String;
        tenant_id                 : String;
        repair_desc               : String;
        repair_reason             : String;
        mold_moving_plan_date     : String;
        mold_complete_plan_date   : String;
        mold_moving_result_date   : String;
        mold_complete_result_date : String;
    }

    // 결과 타입 
    type resultMsg {
        messageCode           : String;
        repair_request_number : String;
        mold_id               : String;
        resultCode            : Integer;
    }

    type data {
        repairItem :  RepairItem_v4 ;
    }

     action saveRemodelRepair ( inputData : data ) returns resultMsg;
}