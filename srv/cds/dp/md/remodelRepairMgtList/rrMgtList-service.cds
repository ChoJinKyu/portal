using { dp as asset } from '../../../../../db/cds/dp/md/DP_MD_ASSET-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model'; 
using { dp as item } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_ITEM-model'; 

namespace dp;

@path : '/dp.RrMgtListService' 
service RrMgtListService {

    view remodelRepairDetail as 
        select key mst.tenant_id 
            , key mst.mold_id 
            , item.repair_request_number 
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
        from moldMst.Md_Mst mst 
        join asset.Md_Asset ass on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id 
        left join item.Md_Repair_Item item on mst.mold_id = item.mold_id and mst.tenant_id = item.tenant_id ;


} 