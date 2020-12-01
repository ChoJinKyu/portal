using { dp as mtlCommodity }    from  '../../../../../db/cds/dp/materialMgr/basicDataMgr/DP_MM_MATERIAL_COMMODITY-model';
using { dp as mtlCommodityLng } from  '../../../../../db/cds/dp/materialMgr/basicDataMgr/DP_MM_MATERIAL_COMMODITY_LNG-model';
namespace dp;
@path : '/dp.MtlCommodityMgrService'

service mtlCommodityMgrService {

    entity MtlCommodity as projection on mtlCommodity.Mm_Material_Commodity;
    entity MtlCommodityLng as projection on mtlCommodityLng.Mm_Material_Commodity_Lng;


}