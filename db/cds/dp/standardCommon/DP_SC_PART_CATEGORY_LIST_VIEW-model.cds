namespace dp;	
@cds.persistence.exists	
// using {dp as partCategoryListView} from '../standardCommon/DP_SC_PART_CATEGORY_LIST_VIEW-model';
	
entity Sc_Part_Category_List_View {	
  key hierarchy_rank : String(5)  not null @title: '테넌트ID' ;	
  key hierarchy_level : String(10) default '*' not null @title: '회사코드' ;	
  key category_code : String(200)  not null @title: '카테고리 코드' ;	
    parent_category_code : String(200)   @title: '상위 카테고리 코드' ;	
    seq : Decimal default 0  @title: '순번' ;	
    category_name : String(2000)   @title: '카테고리 이름' ;	
    status_code : String(10)   @title: '상태코드' ;	
    auth_name : String(1000)   @title: '권한자 성명' ;	
}	