namespace dp;
@cds.persistence.exists

entity Pd_Part_Category_View {	
  key hierarchy_rank : String(5)  not null @title: 'Rank' ;
  key hierarchy_level : String(10) not null @title: 'Level' ;
  key parent_id : String(240)  not null @title: 'parent_id' ;	
  key node_id : String(240)  not null @title: 'node_id' ;	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_group_code : String(30)  not null @title: '카테고리그룹코드' ;
  key category_code : String(40)  not null @title: '카테고리코드' ;
    parent_category_code : String(40)   @title: '상위카테고리코드' ;
    sequence : Decimal default 1  @title: '순번' ;	
    category_name : String(240)   @title: '카테고리명' ;
    active_flag : Boolean   @title: '활성여부' ;	
    update_user_id : String(255) @title: '최종수정자';
    local_update_dtm : DateTime @title: '최종수정일시';
}