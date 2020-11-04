using { dp as moldMst } from '../../../../db/cds/dp/moldMgt/DP_MOLD_MST-model';

namespace dp;
@path : '/dp.DevelopmentReceiptService'
service DevelopmentReceiptService {

    entity MoldMasters as projection on moldMst.Mold_Mst;
}
