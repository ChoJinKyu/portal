namespace cm;	

using util from '../../util/util-model';

entity Menu {	
  key tenent_id : String(5)  not null;	
  key menu_code : String(30)  not null;	
  key parent_menu_code : String(30)  not null;	
    chain_code : String(30)  not null;	
    menu_desc : String(300)  not null;	
    menu_level_number : Decimal   not null;	
    sort_number :   Decimal not null;	
    menu_display_flag : Boolean   not null;	
    menu_type_code : String(30)  not null;	
    use_flag :  Boolean not null;	
	
}	
extend Menu with util.Managed;