namespace dp;	
using util from '../../util/util-model';  	
using { dp as uomclass } from './DP_MM_UOM_CLASS-model';
//using {dp as uomclass} from '../MaterialMgr/DP_MM_UOM_CLASS-model';

//
	
entity Mm_Uom_Class_Lng {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key uom_class_code : String(10)  not null @title: 'UOM Class Code' ;

    parent: Association to uomclass.Mm_Uom_Class
        on parent.tenant_id = tenant_id 
        and parent.uom_class_code = uom_class_code;

  key language_code : String(4)  not null @title: 'Language' ;	
    uom_class_name : String(20)  not null @title: 'UOM Class Name' ;	
    uom_class_desc : String(50)   @title: 'UOM클래스설명' ;	
}	


extend Mm_Uom_Class_Lng with util.Managed;