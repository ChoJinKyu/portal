namespace dp;	
using util from '../../cm/util/util-model'; 	
// using {dp as classSpecName} from '../sc/DP_SC_PART_CLASS_SPEC_NAME-model';	
	
entity Sc_Part_Class_Spec_Name {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key class_code : String(200)  not null @title: '분류 코드' ;	
  key spec_code : String(200)  not null @title: '규격 코드' ;	
    seq : Decimal default 0  @title: '순번' ;	
    status_code : String(10)   @title: '상태 코드' ;	
}	
extend Sc_Part_Class_Spec_Name with util.Managed;	
