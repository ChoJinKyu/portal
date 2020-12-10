using { cm as userMgr }          from '../../../../db/cds/cm/userMgr/CM_USER-model';
using { cm as userRoleGroupMgr } from '../../../../db/cds/cm/userMgr/CM_USER_ROLE_GROUP-model';
namespace cm;

@path : '/cm.UserMgrService'
service UserMgrService {

    entity UserMgr          as projection on userMgr.User; 
    entity UserRoleGroupMgr as projection on userRoleGroupMgr.User_Role_Group;
}