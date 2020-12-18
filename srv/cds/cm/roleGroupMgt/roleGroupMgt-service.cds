using { cm as roleGroupMgt } from '../../../../db/cds/cm/CM_ROLE_GROUP-model';

namespace cm;

@path : '/cm.RoleGroupMgtService'
service RoleGroupMgtService {

    entity RoleGroupMgt as projection on roleGroupMgt.Role_Group;

}