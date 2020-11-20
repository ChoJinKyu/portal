using { dp as moldSpec } from '../../../../db/cds/dp/moldMgt/DP_MOLD_SPEC-model';
using { dp as moldSchedule } from '../../../../db/cds/dp/moldMgt/DP_MOLD_SCHEDULE-model';
using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST-model';
using { dp as moldMstSpecView } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST_SPEC_VIEW-model';

namespace dp;
@path : '/dp.DetailSpecEntryService'
service DetailSpecEntryService {

    entity MoldSpec as projection on moldSpec.Mold_Spec;
    entity MoldSchedule as projection on moldSchedule.Mold_Schedule;
    entity MoldMasters as projection on moldMst.Mold_Mst;
    entity MoldMasterSpec as projection on moldMstSpecView.Mold_Mst_Spec_View;
    
}
