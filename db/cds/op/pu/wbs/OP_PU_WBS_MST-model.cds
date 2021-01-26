namespace op;	
using util from '../../../cm/util/util-model';

entity Pu_Wbs_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key wbs_code : String(30)  not null @title: 'WBS코드' ;	
    wbs_id : String(10)  not null @title: 'WBSID' ;	
    wbs_name : String(100)  not null @title: 'WBS명' ;	
}	

extend Pu_Wbs_Mst with util.Managed;