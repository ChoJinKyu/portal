using {cm as menu} from '../../../../db/cds/cm/menuMgr/CM_MENU-model';
using {cm as menuLng} from '../../../../db/cds/cm/menuMgr/CM_MENU_LNG-model';

namespace cm;

service menuMgrService {

  entity Menu     as projection on menu.Menu;
  entity Menu_haa as projection on menu.Menu_haa;
  entity MenuLng  as projection on menuLng.Menu_Lng;
}
