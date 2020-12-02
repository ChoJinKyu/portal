using { dp as mtlGroup }    from  '../../../../../db/cds/dp/materialMgr/basicDataMgr/DP_MM_MATERIAL_GROUP-model';
using { dp as mtlGroupLng } from  '../../../../../db/cds/dp/materialMgr/basicDataMgr/DP_MM_MATERIAL_GROUP_LNG-model';
namespace dp;
@path : '/dp.MtlGroupMgrService'

service mtlGroupMgrService {

    entity MtlGroup as projection on mtlGroup.Mm_Material_Group;
    entity MtlGroupLng as projection on mtlGroupLng.Mm_Material_Group_Lng;

}
