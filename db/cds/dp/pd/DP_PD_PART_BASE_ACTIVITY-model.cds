namespace dp;	
using util from '../../cm/util/util-model';  	
using {dp as DpBaseActivityLng} from '../pd/DP_PD_PART_BASE_ACTIVITY_LNG-model';	
using {dp as DpBaseActivityCategory} from '../pd/DP_PD_PART_BASE_ACTIVITY_CATEGORY-model';	
// using {dp as DpBaseActivity} from '../pd/DP_PD_PART_BASE_ACTIVITY-model';	
	
entity Pd_Part_Base_Activity {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key activity_code : String(40)  not null @title: '활동코드' ;	

          children1          : Composition of many DpBaseActivityLng.Pd_Part_Base_Activity_Lng
                                on  children1.tenant_id  = tenant_id
                                and children1.activity_code = activity_code;

          children2          : Composition of many DpBaseActivityCategory.Pd_Part_Base_Activity_Category
                                on  children2.tenant_id  = tenant_id
                                and children2.activity_code = activity_code;

    sequence : Decimal default 1  @title: '순번' ;	
    description : String(240)   @title: '설명' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Part_Base_Activity with util.Managed;	

@cds.persistence.exists
entity Pd_Part_Base_Activity_Category_Pop_View {
    key tenant_id             : String;
    key category_group_code   : String;
    key category_code         : String;
        category_group_name   : String;
        category_name         : String;
        path                  : String;
        sequence              : Decimal;
        active_flag           : Boolean;
};

@cds.persistence.exists
entity Pd_Part_Base_Activity_Category_View {
    key tenant_id             : String;
    key activity_code         : String;
    key category_group_code   : String;
    key category_code         : String;
        category_group_name   : String;
        category_name         : String;
        active_flag           : Boolean;
        s_grade_standard_days : Integer;
        a_grade_standard_days : Integer;
        b_grade_standard_days : Integer;
        c_grade_standard_days : Integer;
        d_grade_standard_days : Integer;
        update_user_id        : String;
        local_update_dtm      : DateTime;
};

@cds.persistence.exists
entity Pd_Select_An_Activity_View {
    key tenant_id             : String;
    key activity_code         : String;
        activity_name         : String;
        active_flag           : Boolean;
};