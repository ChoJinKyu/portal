namespace cm;

using util from '../util/util-model';
using {cm.Menu as Menu} from './CM_MENU-model';

entity Menu_Lng {
  key tenant_id     : String(5) not null;
  key menu_code     : String(30) not null;
  key language_code : String(30) not null;
      menu_name     : String(240) not null;

      parent        : Association to Menu
                        on  parent.tenant_id = tenant_id
                        and parent.menu_code = menu_code;
}

extend Menu_Lng with util.Managed;
