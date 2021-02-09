namespace dp;	
	
entity Pd_Part_Category_Activity_Temp {	
   tenant_id : String(5)  null @title: '테넌트ID' ;	
   company_code : String(10) default '*' null @title: '회사코드' ;	
   org_type_code : String(2)  null @title: '조직유형코드' ;	
   org_code : String(10)  null @title: '조직코드' ;	
   category_group_code : String(30)  null @title: '카테고리 그룹 코드' ;	
   category_code : String(40)  null @title: '카테고리' ;	
   part_project_type_code : String(30)  null @title: '부품PJT유형' ;	
   activity_code : String(40)  null @title: 'Activity코드' ;	
    s_grade_standard_days : Integer default 0  @title: 'S' ;	
    a_grade_standard_days : Integer default 0  @title: 'A' ;	
    b_grade_standard_days : Integer default 0  @title: 'B' ;	
    c_grade_standard_days : Integer default 0  @title: 'C' ;	
    d_grade_standard_days : Integer default 0  @title: 'D' ;	
    active_flag : Boolean   @title: 'Status' ;
    crud_type_code : String(1) null;
   new_category_code : String(40)  null @title: '신규 카테고리' ;	
};