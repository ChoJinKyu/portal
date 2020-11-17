namespace dp;	
using util from '../../util/util-model';  	
using {dp as materialSpecValueHis} from '../standardCommon/DP_SC_MATERIAL_SPEC_VALUE_HIS-model';	
	
entity Sc_Material_Spec_Value_His {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null ;	
  key org_type_code : String(30)  not null @title: '구매운영조직유형' ;	
  key org_code : String(10)  not null @title: '구매운영조직코드' ;	
  key material_code : String(40)  not null @title: '부품 번호' ;	
  key spec_code : String(200)  not null @title: '규격 코드' ;	
  key version : Decimal default 0 not null @title: '버전' ;	
    spec_name : String(2000)   @title: '규격 명' ;	
    spec_value : String(2000)   @title: '규격 값' ;	
}	
extend Sc_Material_Spec_Value_His with util.Managed;