namespace op;	
using util from '../../../cm/util/util-model';

entity Pu_Asset_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key asset_number : String(30)  not null @title: '자산번호' ;	
      asset_name : String(100)  not null @title: '자산명' ;	
}	


extend Pu_Asset_Mst with util.Managed;