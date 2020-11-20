namespace dp;	
using util from '../../util/util-model'; 	
// using {dp as categorySpecManage} from '../standardCommon/DP_SC_PART_CATEGORY_SPEC_MANAGE-model';	
	
entity Sc_Part_Category_Spec_Manage {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_code : String(200)  not null @title: '카테고리 코드' ;	
  key spec_code : String(200)  not null @title: '규격 코드' ;	
    seq : Decimal default 0  @title: '순번' ;	
    detail_flag : Boolean   @title: '상세플래그' ;	
    search_condition_flag : Boolean   @title: '검색조건플래그' ;	
    class_code : String(200)   @title: '분류 코드' ;	
    status_code : String(10)   @title: '상태 코드' ;	
}	
extend Sc_Part_Category_Spec_Manage with util.Managed;	
