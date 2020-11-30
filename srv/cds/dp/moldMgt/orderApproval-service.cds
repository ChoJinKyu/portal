using { dp as approvalMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_APPROVAL_MST-model';
using { dp as approvalDtl } from '../../../../db/cds/dp/moldMgt/DP_MOLD_APPROVAL_DTL-model';

using {cm as orgMapping} from '../../../../db/cds/cm/purOrgMgr/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm as Org} from '../../../../db/cds/cm/purOrgMgr/CM_PUR_OPERATION_ORG-model';

namespace dp;
@path : '/dp.DevelopmentReceiptService'
service DevelopmentReceiptService {

    entity MoldMasters as projection on moldMst.Mold_Mst;
    
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
    select distinct key a.tenant_id, key a.part_number, a.spec_name
    from moldMst.Mold_Mst a
    where a.part_number is not null;
}
