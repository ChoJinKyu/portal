namespace op;	
using util from '../../../cm/util/util-model';

entity Pu_Account_Mst {	
  key tenant_id : String(5)      not null @title: '테넌트ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key account_code : String(30)  not null @title: '계정코드' ;	
  key language_code : String(4)  not null @title: '언어코드' ;	
      account_name : String(100)   not null @title: '계정명' ;	
}	


extend Pu_Account_Mst with util.Managed;