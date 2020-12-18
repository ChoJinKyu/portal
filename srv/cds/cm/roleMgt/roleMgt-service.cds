using { cm as roleMgt } from '../../../../db/cds/cm/CM_ROLE-model';
using { cm as roleMenuMgt } from '../../../../db/cds/cm/CM_ROLE_MENU-model';

namespace cm;

service roleMgtService {

    entity Role as projection on roleMgt.Role;
    entity Role_Menu as projection on roleMenuMgt.Role_Menu;
}