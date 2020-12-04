namespace sp;	
using util from '../../cm/util/util-model';

entity Sup_Supplier_Role {	
  key tenant_id : String(5)  not null;	
  key supplier_code : String(10)  not null;	
  key  bp_role_code : String(30)  not null;	
    old_supplier_code : String(15) ;
}	

extend Sup_Supplier_Role with util.Managed;