namespace dp;
@cds.persistence.exists

entity Pd_Activity_Standard_Day_View {	
  key tenant_id               : String(5)  not null @title: '테넌트ID' ;	
      company_code            : String(10)          @title: '회사코드' ;	
      org_type_code           : String(2)           @title: '조직유형코드' ;	
      org_code                : String(10)          @title: '조직코드' ;	
      category_group_code     : String(30)          @title: '카테고리그룹코드' ;	
      category_code           : String(40)          @title: '카테고리 코드' ;	
      part_project_type_code  : String(30)          @title: '부품PJT유형' ;	
      activity_code           : String(40)          @title: '부품활동코드' ;	
      org_name                : String(240)         @title: '조직명' ;
      category_name           : String(240)         @title: '카테고리명' ;
      path_name               : String(240)         @title: '카테고리 PATH명' ;
	  part_project_type_name  : String(240)         @title: '부품PJT유형' ;
      activity_name           : String(240)         @title: '활동명' ;
      actual_role             : String(240)         @title: '역할코드' ;
      role_name               : String(240)         @title: '역할명' ;
      s_grade_standard_days   : Decimal             @title: '표준일수 s' ;
      a_grade_standard_days   : Decimal             @title: '표준일수 a' ;
      b_grade_standard_days   : Decimal             @title: '표준일수 b' ;
      c_grade_standard_days   : Decimal             @title: '표준일수 c' ;
      d_grade_standard_days   : Decimal             @title: '표준일수 d' ;
      active_flag             : Boolean             @title: '활성여부' ;
      active_flag_val         : String(1)           @title: '활성여부값' ;
      s_grade_standard_days_ori   : Decimal             @title: '표준일수 s ori' ;
      a_grade_standard_days_ori   : Decimal             @title: '표준일수 a ori' ;
      b_grade_standard_days_ori   : Decimal             @title: '표준일수 b ori' ;
      c_grade_standard_days_ori   : Decimal             @title: '표준일수 c ori' ;
      d_grade_standard_days_ori   : Decimal             @title: '표준일수 d ori' ;
      active_flag_ori             : Boolean             @title: '활성여부 ori' ;
      update_user_id          : String(255)         @title: '최종수정자' ;
      local_update_dtm        : DateTime            @title: '최종수정일시' ;
}