namespace dp;
@cds.persistence.exists

entity Pd_Activity_Standard_Day_View {	
  key tenant_id               : String(5)  not null @title: '테넌트ID' ;	
  key company_code            : String(10) default'*' not null @title: '회사코드' ;	
  key org_type_code           : String(2)  not null @title: '조직유형코드' ;	
  key org_code                : String(10) not null @title: '조직코드' ;	
  key category_group_code     : String(30) not null @title: '카테고리그룹코드' ;	
  key category_code           : String(40) not null @title: '카테고리 코드' ;	
  key part_project_type_code  : String(30) not null @title: '부품PJT유형' ;	
  key activity_code           : String(40) not null @title: '부품활동코드' ;	
      category_name           : String(240)         @title: '카테고리명' ;
	  part_project_type_name  : String(240)         @title: '부품PJT유형' ;
      activity_name           : String(240)         @title: '활동명' ;
      s_grade_standard_days   : Decimal             @title: '표준일수 s' ;
      a_grade_standard_days   : Decimal             @title: '표준일수 a' ;
      b_grade_standard_days   : Decimal             @title: '표준일수 b' ;
      c_grade_standard_days   : Decimal             @title: '표준일수 c' ;
      d_grade_standard_days   : Decimal             @title: '표준일수 d' ;
      active_flag             : Boolean             @title: '활성여부' ;
      update_user_id          : String(255)         @title: '최종수정자' ;
      local_update_dtm        : DateTime            @title: '최종수정일시' ;
}