namespace sp;	
using util from '../../util/util-model';

entity Sup_Supplier_Role {	
  key tenant_id : String(5)  not null;	
  key supplier_code : String(10)  not null;	
    bp_role_code : String(10)  ;	
    old_supplier_code : String(15) ;
}	

extend Sup_Supplier_Role with util.Managed;