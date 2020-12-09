using { cm as roleGroupMgr } from '../../../../db/cds/cm/roleGroupMgr/CM_ROLE_GROUP-model';

namespace cm;

@path : '/cm.RoleGroupMgrService'
service RoleGroupMgrService {

    entity RoleGroupMgr as projection on cm.Role_Group;

}