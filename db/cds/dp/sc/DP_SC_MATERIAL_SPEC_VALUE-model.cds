namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as materialSpecValue} from '../sc/DP_SC_MATERIAL_SPEC_VALUE-model';	
	
entity Sc_Material_Spec_Value {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	
  key spec_code : String(200)  not null @title: '규격 코드' ;	
    spec_name : String(2000)   @title: '규격 명' ;	
    spec_value : String(2000)   @title: '규격 값' ;	
}	
extend Sc_Material_Spec_Value with util.Managed;	
