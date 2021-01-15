//Table
//View
using {pg as MiBom} from '../../../../db/cds/pg/mi/PG_MI_SAC_MI_BOM_MAPPING_VIEW-model';    //시황BOM Mapping
using {pg as ExchRate} from '../../../../db/cds/pg/mi/PG_MI_SAC_EXCH_RATE_VIEW-model';      //환율

namespace pg;

@path : '/pg.marketIntelligenceSacTService'
service marketIntelligenceSacTService {

    // Entity List
    // View List
    view MiSacMiBomMappingView @(title : '시황BOM Mapping View') as select from MiBom.Mi_Sac_Mi_Bom_Mapping_View;       //시황BOM Mapping
    view MiSacExchRateView @(title : '환율 View') as select from ExchRate.Mi_Sac_Exch_Rate_View;                        //환율

}