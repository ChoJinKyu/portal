using {cm as menu} from '../../../../db/cds/cm/CM_MENU-model';
using {cm as menuLng} from '../../../../db/cds/cm/CM_MENU_LNG-model';

namespace cm;

service menuMgtService {

  entity Menu     as projection on menu.Menu;
  entity Menu_haa as projection on menu.Menu_haa;
  // view Menu_haa(language_code : String(30) default 'KO') as
  //   select from menu.Menu_haa (
  //     language_code : : language_code
  //   ) {
  //     *
  //   };

  entity MenuLng  as projection on menuLng.Menu_Lng;
}
