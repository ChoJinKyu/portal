namespace op;	
using util from '../../../cm/util/util-model';

entity Pu_Cctr_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트아이디' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key cctr_code : String(10)  not null @title: '코스트센터코드' ;	
  key effective_end_date : Date  not null @title: '일자' ;	
  key language_code : String(4)  not null @title: '언어코드' ;	
      effective_start_date : Date  not null @title: '일자' ;	
      cctr_name : String(100)  not null @title: '이름(100)' ;	
}	


extend Pu_Cctr_Mst with util.Managed;