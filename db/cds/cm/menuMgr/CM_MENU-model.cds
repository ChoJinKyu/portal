namespace cm;

using util from '../util/util-model';
using {cm as lng} from './CM_MENU_LNG-model';

entity Menu {
  key tenant_id         : String(5) not null;
  key menu_code         : String(30) not null;
  key parent_menu_code  : String(30) not null;
      chain_code        : String(30) not null;
      menu_desc         : String(300) not null;
      menu_level_number : Decimal not null;
      sort_number       : Decimal not null;
      menu_display_flag : Boolean not null;
      menu_type_code    : String(30) not null;
      use_flag          : Boolean not null;

      parent            : Association to Menu
                            on  parent.tenant_id = $self.tenant_id
                            and parent.menu_code = $self.parent_menu_code;

      children          : Composition of many Menu
                            on children.parent = $self;

      languages         : Composition of many lng.Menu_Lng
                            on  languages.tenant_id = tenant_id
                            and languages.menu_code = menu_code;
}

extend Menu with util.Managed;

@cds.persistence.exists
entity Menu_haa {
  key node_id           : String;
      parent_id         : String;
      tenant_id         : String;
      menu_code         : String;
      menu_name         : String;
      parent_menu_code  : String;
      chain_code        : String;
      menu_desc         : String;
      menu_level_number : Integer;
      sort_number       : Integer;
      menu_display_flag : Boolean;
      menu_type_code    : String;
      use_flag          : Boolean;
      language_code     : String;
}

extend Menu_haa with util.Managed;
