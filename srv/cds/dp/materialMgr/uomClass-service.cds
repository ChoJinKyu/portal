using { dp as uomClass } from '../../../../db/cds/dp/materialMgr/DP_MM_UOM_CLASS-model';
using { dp as uomClassLng } from '../../../../db/cds/dp/materialMgr/DP_MM_UOM_CLASS_LNG-model';
namespace dp;

service UomClassMgrService {

    entity UomClass as projection on uomClass.Mm_Uom_Class;
    entity UomClassLng as projection on uomClassLng.Mm_Uom_Class_Lng;

}
