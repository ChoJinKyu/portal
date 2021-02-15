namespace dp;

@cds.persistence.exists
entity Pd_Activity_Mapping_Name_View {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
      org_name : String(40)  @title: '조직명' ;	
      activity_code : String(40)  @title: '활동코드' ;	
      product_activity_code : String(40)  @title: '제품활동코드' ;	
    activity_dependency_code : String(30) @title: 'Activity 선후행' ;	
    active_flag : Boolean   @title: '활성여부' ;
    active_flag_val : String(10)   @title: 'Active,Inactive' ;
    update_user_id : String(255) @title: '최종수정자';
    local_update_dtm : DateTime @title: '최종수정일시';
    activity_name : String(240)   @title: '활동명' ;   
    product_activity_name: String(240)   @title: '제품활동명' ;   
    activity_dependency_name : String(240) @title: 'Activity 선후행명' ;
}