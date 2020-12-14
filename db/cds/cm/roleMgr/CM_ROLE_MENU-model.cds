namespace cm;	

using util from '../util/util-model';

entity Role_Menu {	
  key tenant_id : String(5)  not null;	
  key role_code : String(30)  not null;	
  key menu_code : String(30)  not null;	
}	
extend Role_Menu with util.Managed;