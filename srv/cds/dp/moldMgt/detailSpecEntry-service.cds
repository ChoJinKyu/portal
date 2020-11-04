using { dp as moldItem } from '../../../../db/cds/dp/moldMgt/DP_MOLD_ITEM-model';
using { dp as moldItemSpec } from '../../../../db/cds/dp/moldMgt/DP_MOLD_ITEM_SPEC-model';

namespace dp;
@path : '/dp.DetailSpecEntryService'
service DetailSpecEntryService {

    entity MoldItem as projection on moldItem.Mold_Item;
    entity MoldItemSpec as projection on moldItemSpec.Mold_Item_Spec;
}
