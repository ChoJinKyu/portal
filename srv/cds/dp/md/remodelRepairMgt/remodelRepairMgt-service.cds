using { dp as repairMstAssetView } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_MST_ASSET_VIEW-model';
using { dp as repairItem } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_ITEM-model';
using { dp as moldMstAssetSpecView } from '../../../../../db/cds/dp/md/DP_MD_MST_ASSET_SPEC_VIEW-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { dp as moldMstSpecView } from '../../../../../db/cds/dp/md/DP_MD_MST_SPEC_VIEW-model';

using {cm as orgMapping} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm as Org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.RemodelRepairMgtService'
service RemodelRepairMgtService {

    entity RepairMstAssetView as projection on repairMstAssetView.Md_Repair_Mst_Asset_View;
    entity RepairItem as projection on repairItem.Md_Repair_Item;
    entity MoldMstAssetSpecView as projection on moldMstAssetSpecView.Md_Mst_Asset_Spec_View;
    entity MoldMasterSpec as projection on moldMstSpecView.Md_Mst_Spec_View;

    view Divisions as
    select key a.tenant_id       
            ,key a.company_code  
            ,key a.org_type_code 
            ,key a.org_code         
                ,a.org_name          
                ,a.purchase_org_code 
                ,a.plant_code        
                ,a.affiliate_code    
                ,a.bizdivision_code  
                ,a.bizunit_code      
                ,a.au_code           
                ,a.hq_au_code        
                ,a.use_flag  
    from Org.Pur_Operation_Org a  
    left join orgMapping.Pur_Org_Type_Mapping b
    on a.tenant_id=b.tenant_id
    and a.org_type_code=b.org_type_code
    where b.process_type_code='DP05';

    view Models as
    select distinct key a.tenant_id, key a.model
    from moldMst.Md_Mst a
    where a.model is not null;

    view PartNumbers as
    select distinct key a.tenant_id, key a.mold_number, a.spec_name, a.mold_item_type_name
    from moldMstSpecView.Md_Mst_Spec_View a
    where a.mold_number is not null;
    
}
