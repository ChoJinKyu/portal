namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as materialReplaceHis} from '../standardCommon/DP_SC_MATERIAL_REPLACE_HIS-model';	
	
entity Sc_Material_Replace_His {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '구매운영조직유형' ;	
  key org_code : String(10)  not null @title: '구매운영조직코드' ;	
  key replace_group_code : String(200)  not null @title: '대치그룹코드' ;	
  key replace_seq : Decimal default 0 not null @title: '대치순번' ;	
  key yyyymm : String(6)  not null @title: '년월' ;	
    material_code : String(40)   @title: '부품 번호' ;	
}	
extend Sc_Material_Replace_His with util.Managed;	