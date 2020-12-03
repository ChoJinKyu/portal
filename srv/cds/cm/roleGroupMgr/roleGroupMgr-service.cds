using { cm as roleGroupMgr } from '../../../../db/cds/cm/roleGroupMgr/CM_ROLE_GROUP-model';

namespace cm;

service roleGroupMgrService {

    entity RoleGroupMgr as projection on roleGroupMgr.Role_Group;

}