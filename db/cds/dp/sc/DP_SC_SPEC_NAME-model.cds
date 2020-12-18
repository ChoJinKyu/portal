namespace dp;	
using util from '../../cm/util/util-model'; 	
// using {dp as specName} from '../sc/DP_SC_SPEC_NAME-model';	
	
entity Sc_Spec_Name {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(30)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key spec_code : String(200)  not null @title: '규격 코드' ;	
    spec_name : String(2000)   @title: '규격 명' ;	
    status_code : String(10)   @title: '상태 코드' ;	
    base_uom_code : String(3)   @title: '기본UOM' ;	
}	
extend Sc_Spec_Name with util.Managed;	
