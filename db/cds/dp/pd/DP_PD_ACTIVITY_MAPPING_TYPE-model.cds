namespace dp;	

@cds.persistence.exists	
entity Pd_Activity_Mapping_Type {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key activity_code : String(40)  not null @title: '활동코드' ;	
  key product_activity_code : String(40)  not null @title: '제품활동코드' ;	
    activity_dependency_code : String(30) @title: 'Activity 선후행' ;	
    active_flag : Boolean   @title: '활성여부' ;
    update_user_id : String(255) @title: '최종수정자';
    syste_update_dtm : DateTime @title: '최종수정일시';    
    crud_type_code : String(1)     @title: 'CRUD유형';
    update_activity_code : String(40)  not null @title: '변경후 활동코드' ;	
    update_product_activity_code : String(40)  not null @title: '변경후 제품활동코드' ;	
}