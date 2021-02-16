namespace dp;	


entity Pd_Activity_Mapping_Temp {	
  tenant_id : String(5)  @title: '테넌트ID' ;	
  company_code : String(10) @title: '회사코드' ;	
  org_type_code : String(2) @title: '조직유형코드' ;	
  org_code : String(10) @title: '조직코드' ;	
  activity_code : String(40)@title: '활동코드' ;	
  product_activity_code : String(40) @title: '제품활동코드' ;	
    activity_dependency_code : String(30) @title: 'Activity 선후행' ;	
    active_flag : Boolean   @title: '활성여부' ;
    update_user_id : String(255) @title: '최종수정자';
    local_update_dtm  : DateTime @title: '최종수정일시';    
    crud_type_code : String(1)     @title: 'CRUD유형';
    update_activity_code : String(40) @title: '변경 활동코드' ;	
    update_product_activity_code : String(40) @title: '변경 제품활동코드' ;	
}