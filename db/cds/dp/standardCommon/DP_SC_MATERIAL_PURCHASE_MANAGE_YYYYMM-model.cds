namespace dp;	
using util from '../../util/util-model';  	
// using {dp as materialPurchaseManageYyyymm} from '../standardCommon/DP_SC_MATERIAL_PURCHASE_MANAGE_YYYYMM-model';	
	
entity Sc_Material_Purchase_Manage_Yyyymm {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(30)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	
  key yyyymm : String(6)  not null @title: '년월' ;	
    status_code : String(10)   @title: '상태 코드' ;	
    standard_part_flag : Boolean   @title: '표준부품여부' ;	
    common_part_flag : Boolean   @title: '공용부품여부' ;	
    recommend_part_flag : Boolean   @title: '추천부품여부' ;	
    recommend_reason : String(200)   @title: '추천사유' ;	
    replace_group_code : String(30)   @title: '대치그룹코드' ;	
}	
extend Sc_Material_Purchase_Manage_Yyyymm with util.Managed;