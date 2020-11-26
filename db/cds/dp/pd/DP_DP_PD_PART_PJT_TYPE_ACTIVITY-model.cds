namespace dp;	
using util from '../../util/util-model'; 	
// using { as } from '/DP_PD_PART_PJT_TYPE_ACTIVITY-model';	
	
entity Pd_Part_Pjt_Type_Activity {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key part_pjt_type : String(30)  not null @title: '부품PJT유형' ;	
  key part_activity_code : String(50)  not null @title: '부품활동코드' ;	
    use_flag : Boolean   @title: '사용플래그' ;	
    seq : Decimal default 1  @title: '순번' ;	
    status_code : String(10)   @title: '상태코드' ;	
}	
extend Pd_Part_Pjt_Type_Activity with util.Managed;