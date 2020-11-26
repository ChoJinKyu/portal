using { dp as uom } from '../../../../../db/cds/dp/materialMgr/uomMgr/DP_MM_UNIT_OF_MEASURE-model';
using { dp as uomLng } from '../../../../../db/cds/dp/materialMgr/uomMgr/DP_MM_UNIT_OF_MEASURE_LNG-model';
namespace dp;
@path : '/dp.UomMgrService'

service UomMgrService {

    entity Uom as projection on uom.Mm_Unit_Of_Measure;
    entity UomLng as projection on uomLng.Mm_Unit_Of_Measure_Lng;

}
