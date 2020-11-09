namespace dp;	
using util from '../../util/util-model'; 	
	
entity Mm_Uom_Class {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key uom_class_code : String(10)  not null @title: 'UOM클래스코드' ;	
    uom_class_name : String(20)   @title: 'UOM클래스명' ;	
    base_uom_code : String(3)   @title: '기본UOM' ;	
    base_uom_name : String(30)   @title: '기본UOM명' ;	
    uom_class_desc : String(50)   @title: 'UOM클래스설명' ;	
    disable_date : Date   @title: '불가일자' ;	
}	

extend Mm_Uom_Class with util.Managed;