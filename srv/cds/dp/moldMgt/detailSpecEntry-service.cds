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
    where a.tenant_id='L1100'
    and a.org_type_code=(select b.org_type_code 
                        from orgMapping.Pur_Org_Type_Mapping b 
                        where b.tenant_id='L1100' 
                        and b.process_type_code='DP05')
}
