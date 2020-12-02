using { dp as mtlClass } from '../../../../../db/cds/dp/materialMgr/basicDataMgr/DP_MM_MATERIAL_CLASS-model';
using { dp as mtlClassLng } from  '../../../../../db/cds/dp/materialMgr/basicDataMgr/DP_MM_MATERIAL_CLASS_LNG-model';
namespace dp;
@path : '/dp.MtlClassMgrService'

service mtlClassMgrService {

    entity MtlClass as projection on mtlClass.Mm_Material_Class;
    entity MtlClassLng as projection on mtlClassLng.Mm_Material_Class_Lng;


}
