using {dp as arlHeader} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_HEADER-model';
using {dp as arlLine} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_LINE-model';

namespace dp;

@path : '/dp.BasePriceArlService'
service BasePriceArlService {
    entity Base_Price_Arl_Header as projection on arlHeader.VI_Base_Price_Arl_Header;
    entity Base_Price_Arl_Line   as projection on arlLine.VI_Base_Price_Arl_Line;
}
