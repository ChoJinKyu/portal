namespace dp;	
using util from '../../util/util-model';  	
using {dp as materialScManage} from '../standardCommon/DP_SC_MATERIAL_SC_MANAGE-model';	
	
entity Sc_Material_Sc_Manage {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(30)  not null @title: '구매운영조직유형' ;	
  key org_code : String(10)  not null @title: '구매운영조직코드' ;	
  key material_code : String(40)  not null @title: '부품 번호' ;	
  key sc_type : String(10)  not null @title: '표준화공용화유형' ;	
    sc_type_value : String(200)   @title: '표준화공용화유형값' ;	
}	
extend Sc_Material_Sc_Manage with util.Managed;