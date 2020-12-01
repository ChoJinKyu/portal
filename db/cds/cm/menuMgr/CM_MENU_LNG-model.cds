namespace cm;	

using util from '../util/util-model';

entity Menu_Lng {	
  key tenent_id : String(5)  not null;	
  key menu_code : String(30)  not null;	
  key language_code : String(30)  not null;	
    menu_name : String(240)  not null;	
}	
extend Menu_Lng with util.Managed;