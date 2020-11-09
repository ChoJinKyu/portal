using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST-model';
using { dp as moldMstView } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST_VIEW-model';

namespace dp;
@path : '/dp.DevelopmentReceiptService'
service DevelopmentReceiptService {

    entity MoldMasters as projection on moldMstView.Mold_Mst_View;
}
