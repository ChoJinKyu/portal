//Table
//View
using {pg as MiBom} from '../../../../db/cds/pg/mi/PG_MI_SAC_MI_BOM_MAPPING_VIEW-model';

namespace pg;

@path : '/pg.marketIntelligenceSacTService'
service marketIntelligenceSacTService {

    // Entity List
    // View List
    view MiSacMiBomMappingView @(title : '시황BOM Mapping View') as select from MiBom.Mi_Sac_Mi_Bom_Mapping_View;

}