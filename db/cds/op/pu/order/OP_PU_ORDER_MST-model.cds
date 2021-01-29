namespace op;	
using util from '../../../cm/util/util-model';

entity Pu_Order_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key order_number : String(30)  not null @title: '오더번호' ;	
      order_name : String(100)  not null @title: '오더명' ;	
}	



extend Pu_Order_Mst with util.Managed;