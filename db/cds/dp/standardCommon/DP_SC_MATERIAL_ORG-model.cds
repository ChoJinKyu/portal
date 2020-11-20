namespace dp;	
using util from '../../util/util-model';  	
// using {dp as materialMst} from '../standardCommon/DP_SC_MATERIAL_ORG-model';	
	
entity Sc_Material_Org {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	
    category_code : String(200)   @title: '카테고리 코드' ;	
    class_code : String(200)   @title: '분류코드' ;	
    class_name : String(2000)   @title: '분류명' ;	
    spec_summary : String(2000)   @title: '규격요약' ;	
    repr_maker_info : String(2000)   @title: '대표 제조사 정보' ;	
    uom : String(3)   @title: '단위' ;	
    uit : String(30)   @title: 'UIT' ;	
    commodity_code : String(100)   @title: '코모디티코드' ;	
    part_status_code : String(10)   @title: '부품상태코드' ;	
    spec_value_list_code : String(10)   @title: '규격 값 목록 코드' ;		
}	
extend Sc_Material_Org with util.Managed;