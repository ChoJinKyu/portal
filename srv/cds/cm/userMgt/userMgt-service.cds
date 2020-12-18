using { cm as userMgt }          from '../../../../db/cds/cm/CM_USER-model';
using { cm as userRoleGroupMgt } from '../../../../db/cds/cm/CM_USER_ROLE_GROUP-model';
namespace cm;

@path : '/cm.UserMgtService'
service UserMgtService {

    entity UserMgt          as projection on userMgt.User; 
    entity UserRoleGroupMgt as projection on userRoleGroupMgt.User_Role_Group;
}