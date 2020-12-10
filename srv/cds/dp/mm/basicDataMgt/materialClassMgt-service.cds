using { dp as Class } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS-model';
using { dp as ClassLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS_LNG-model';
namespace dp;
@path : '/dp.MtlClassMgtService'

service MtlClassMgtService {

    entity MtlClass as projection on Class.Mm_Material_Class;
    entity MtlClassLng as projection on ClassLng.Mm_Material_Class_Lng;


}
