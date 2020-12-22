// using { cm as userRoleGroup } from '../../../../db/cds/cm/CM_USER_ROLE_GROUP-model';
// using { cm as role } from '../../../../db/cds/cm/CM_ROLE-model';
// using { cm as roleMenu } from '../../../../db/cds/cm/CM_ROLE_MENU-model';

using { cm.User_Role_Group as cm_user_role_group } from '../../../../db/cds/cm/CM_USER_ROLE_GROUP-model';
using { cm.Role as cm_role } from '../../../../db/cds/cm/CM_ROLE-model';
using { cm.Role_Menu as cm_role_menu } from '../../../../db/cds/cm/CM_ROLE_MENU-model';

namespace cm;

@path : '/cm.MenuMgtV4Service'
service MenuMgtV4Service {

//   entity cm_user_role_group as projection on userRoleGroup.User_Role_Group;
//   entity cm_role as projection on role.Role;
//   entity cm_role_menu   as projection on roleMenu.Role_Menu;

  view Menu (
    tenant_id : String(5),
    user_id : String(50)
  ) as 
  select	m.menu_code as menu_code
    from	cm_user_role_group g,
            cm_role r,
            cm_role_menu m
    where	g.tenant_id = :tenant_id
    and 	g.user_id = :user_id
    and		g.tenant_id = r.tenant_id
    and		g.role_group_code = r.role_code
    and		r.tenant_id = m.tenant_id
    and		r.role_code = m.role_code;
}
