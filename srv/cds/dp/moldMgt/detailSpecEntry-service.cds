using { dp as moldSpec } from '../../../../db/cds/dp/moldMgt/DP_MOLD_SPEC-model';
using { dp as moldSchedule } from '../../../../db/cds/dp/moldMgt/DP_MOLD_SCHEDULE-model';
using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST-model';
using { dp as moldMstSpecView } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST_SPEC_VIEW-model';

using {cm as orgMapping} from '../../../../db/cds/cm/purOrgMgr/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm as Org} from '../../../../db/cds/cm/purOrgMgr/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.DetailSpecEntryService'
service DetailSpecEntryService {

    entity MoldSpec as projection on moldSpec.Mold_Spec;
    entity MoldSchedule as projection on moldSchedule.Mold_Schedule;
    entity MoldMasters as projection on moldMst.Mold_Mst;
    entity MoldMasterSpec as projection on moldMstSpecView.Mold_Mst_Spec_View;

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
    from moldMst.Mold_Mst a
    where a.model is not null;

    view PartNumbers as
    select distinct key a.tenant_id, key a.part_number, a.spec_name, a.mold_item_type_name
    from moldMstSpecView.Mold_Mst_Spec_View a
    where a.part_number is not null;

    view CreateUsers as
    select distinct key a.tenant_id, key a.create_user_id, a.create_user_name
    from moldMstSpecView.Mold_Mst_Spec_View a
    where a.create_user_id is not null;
}
