using { cm as userMgr }          from '../../../../db/cds/cm/userMgr/CM_USER-model';
using { cm as userRoleGroupMgr } from '../../../../db/cds/cm/userMgr/CM_USER_ROLE_GROUP-model';
using { cm as userView}          from '../../../../db/cds/cm/userMgr/CM_USER_VIEW-model';

namespace cm;

service UserMgrService {

    entity UserMgr          as projection on userMgr.User; 
    entity UserRoleGroupMgr as projection on userRoleGroupMgr.User_Role_Group;
    entity UserMgrView      as projection on userView.User_View;

}