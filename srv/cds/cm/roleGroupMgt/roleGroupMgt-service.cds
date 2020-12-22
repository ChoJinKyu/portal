using { cm as roleGroupMgt } from '../../../../db/cds/cm/CM_ROLE_GROUP-model';
using { cm as roleGroupMap } from '../../../../db/cds/cm/CM_ROLE_GROUP_MAP-model';

namespace cm;

@path : '/cm.RoleGroupMgtService'
service RoleGroupMgtService {

    entity RoleGroupMgt as projection on roleGroupMgt.Role_Group;
    entity RoleGroupMap as projection on roleGroupMap.Role_Group_Map;

}