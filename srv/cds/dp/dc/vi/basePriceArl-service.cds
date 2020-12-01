using {dp as arlMaster} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_MST-model';
using {dp as arlDetail} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_DTL-model';
using {dp as arlPrice} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_PRICE-model';

namespace dp;

@path : '/dp.BasePriceArlService'
service BasePriceArlService {
    entity Base_Price_Arl_Master as projection on arlMaster.VI_Base_Price_Arl_Mst;
    entity Base_Price_Arl_Detail as projection on arlDetail.VI_Base_Price_Arl_Dtl;
    entity Base_Price_Arl_Price  as projection on arlPrice.VI_Base_Price_Arl_Price;
}
