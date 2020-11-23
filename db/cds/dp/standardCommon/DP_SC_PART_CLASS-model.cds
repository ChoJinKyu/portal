namespace dp;	
using util from '../../util/util-model'; 	
// using {dp as partClass} from '../standardCommon/DP_SC_PART_CLASS-model';	
	
entity Sc_Part_Class {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '구매운영조직유형' ;	
  key org_code : String(10)  not null @title: '구매운영조직코드' ;	
  key class_code : String(200)  not null @title: '분류코드' ;	
    parent_class_code : String(200)   @title: '상위분류코드' ;	
    seq : Decimal default 0  @title: '순번' ;	
    class_name : String(2000)   @title: '분류명' ;	
    desc : String(2000)   @title: '설명' ;	
    status_code : String(10)   @title: '상태코드' ;	
}	
extend Sc_Part_Class with util.Managed;