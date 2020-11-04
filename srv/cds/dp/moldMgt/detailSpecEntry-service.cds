using { dp as itemSpec } from '../../../../db/cds/dp/moldMgt/DP_ITEM_SPEC-model';

namespace dp;
@path : '/dp.DetailSpecEntryService'
service DetailSpecEntryService {

    entity ItemSpec as projection on itemSpec.Item_Spec;
}
