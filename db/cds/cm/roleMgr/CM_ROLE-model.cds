namespace cm;	

using util from '../util/util-model';

entity Role {	
  key tenant_id : String(5)  not null;	
  key role_code : String(30)  not null;	
    chian_code : String(30)  not null;	
    role_name : String(30)  not null;	
    role_desc : String(300)  not null;	
    use_flag : Boolean  not null @title: '사용여부';
}	
extend Role with util.Managed;