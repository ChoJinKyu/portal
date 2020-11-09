namespace dp;	
using util from '../../util/util-model';  	
using {dp.Sc_Partno_Purchase_Manage as Partno_Purchase_Manage} from '../standardCommon/DP_SC_PARTNO_PURCHASE_MANAGE-model';	
	
entity Sc_Partno_Purchase_Manage {	
  key tenant_id : String(5)  not null ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key operation_type : String(10)  not null @title: '구매운영조직유형' ;	
  key operation_code : String(10)  not null @title: '구매운영조직코드' ;	
  key part_no : String(200)  not null @title: '부품 번호' ;	
    status_code : String(10)   @title: '상태 코드' ;	
    standard_part_flag : Boolean   @title: '표준부품여부' ;	
    common_part_flag : Boolean   @title: '공용부품여부' ;	
    push_part_flag : Boolean   @title: '추천부품여부' ;	
    replace_reason : String(200)   @title: '추천사유' ;	
    replace_group_code : String(30)   @title: '대치그룹코드' ;	
}