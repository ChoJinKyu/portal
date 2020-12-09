using { cm as roleMgr } from '../../../../db/cds/cm/roleMgr/CM_ROLE-model';
using { cm as roleMenuMgr } from '../../../../db/cds/cm/roleMgr/CM_ROLE_MENU-model';

namespace cm;

service roleMgrService {

    entity Role as projection on roleMgr.Role;
    entity Role_Menu as projection on roleMenuMgr.Role;

}