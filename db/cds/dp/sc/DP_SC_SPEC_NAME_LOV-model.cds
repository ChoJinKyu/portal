namespace dp;	
using util from '../../cm/util/util-model'; 	
// using {dp as specNameLov} from '../sc/DP_SC_SPEC_NAME_LOV-model';	
	
entity Sc_Spec_Name_Lov {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key spec_code : String(200)  not null @title: '규격 코드' ;	
  key spec_value_code : String(200)  not null @title: '규격 값 코드' ;	
    spec_value_name : String(2000)   @title: '규격 값명' ;	
    seq : Decimal default 0  @title: '순번' ;	
    status_code : String(10)   @title: '상태 코드' ;	
}	
extend Sc_Spec_Name_Lov with util.Managed;	
