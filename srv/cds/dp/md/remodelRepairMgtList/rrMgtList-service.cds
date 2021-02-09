using { dp as asset } from '../../../../../db/cds/dp/md/DP_MD_ASSET-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model'; 
using { dp as item } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_ITEM-model'; 

namespace dp;
@path : '/dp.RrMgtListService' 
service RrMgtListService {

    /**
    * @description : Remodel/Repair Management List 상세 
    * @author      : jinseon.lee 
    * @date    : 2021.02.09 
    */
    view remodelRepairDetail as 
        select key mst.tenant_id 
            , key mst.mold_id 
            , key item.repair_request_number 
            , item.create_user_id 
            , item.repair_request_date 
            , item.repair_desc 
            , item.repair_reason 
            , mst.model 
            , mst.mold_number 
            , mst.mold_sequence 
            , ass.class_desc 
            , mst.mold_production_type_code 
            , mst.mold_mfger_code 
            , mst.supplier_code 
            , mst.production_supplier_code  
            , item.mold_moving_plan_date  
            , item.mold_moving_result_date  
            , item.mold_complete_plan_date  
            , item.mold_complete_result_date  
        from item.Md_Repair_Item item 
        join moldMst.Md_Mst mst  on mst.mold_id = item.mold_id and mst.tenant_id = item.tenant_id
        join asset.Md_Asset ass on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id   ;

    /**
    * @description : Remodel/Repair Management List New 
    * @author      : jinseon.lee 
    * @date    : 2021.02.09 
    */
    view remodelRepairNew as 
        select key mst.tenant_id 
            ,  key mst.mold_id 
            , '' as repair_request_number : String(240)  
            , '' as create_user_id : String(240) 
            , '' as repair_request_date : String(240)   
            , '' as repair_desc : String(240)
            , '' as repair_reason : String(240) 
            , mst.model 
            , mst.mold_number 
            , mst.mold_sequence 
            , ass.class_desc 
            , mst.mold_production_type_code 
            , mst.mold_mfger_code 
            , mst.supplier_code 
            , mst.production_supplier_code  
            , '' as mold_moving_plan_date : String(240)  
            , '' as mold_moving_result_date : String(240)  
            , '' as mold_complete_plan_date : String(240)  
            , '' as mold_complete_result_date : String(240)  
        from moldMst.Md_Mst mst 
        join asset.Md_Asset ass on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id 
        ;










} 