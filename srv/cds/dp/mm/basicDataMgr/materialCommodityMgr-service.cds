using { dp as Commodity }    from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY-model';
using { dp as CommodityLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY_LNG-model';
namespace dp;
@path : '/dp.MtlCommodityMgrService'

service mtlCommodityMgrService {

    entity MtlCommodity as projection on Commodity.Mm_Material_Commodity;
    entity MtlCommodityLng as projection on CommodityLng.Mm_Material_Commodity_Lng;


}