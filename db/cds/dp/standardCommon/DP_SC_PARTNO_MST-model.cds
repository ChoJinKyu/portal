namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Partno_Mst as Partno_Mst} from '../standardCommon/DP_SC_PARTNO_MST-model';	
	
entity Sc_Partno_Mst {	
  key tenant_id : String(5)  not null ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key operation_type : String(10)  not null @title: '구매운영조직유형' ;	
  key operation_code : String(10)  not null @title: '구매운영조직코드' ;	
  key part_no : String(200)  not null @title: '부품 번호' ;	
    category_code : String(200)   @title: '카테고리 코드' ;	
    class_code : String(200)   @title: '분류코드' ;	
    class_name : String(2000)   @title: '분류명' ;	
    spec_summary : String   @title: '규격요약' ;	
    repr_maker_info : String(2000)   @title: '대표 제조사 정보' ;	
    uom : String(10)   @title: '단위' ;	
    uit : String(10)   @title: 'User Item Type' ;	
    commodity_code : String(200)   @title: '코모디티코드' ;	
    part_status_code : String(10)   @title: '부품상태코드' ;	
    spec_value_list_code : String(10)   @title: '규격 값 목록 코드' ;	
}