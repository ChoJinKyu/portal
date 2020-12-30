namespace sp;	
using util from '../../cm/util/util-model';  	
// using {sp as categoryClass} from '../standardCommon/SP_SE_EVAL_SHEET_DISTRIBUTION_SCORE-model';	
	
entity Se_Eval_Sheet_Distribution_Score {	
  key tenant_id                      : String(5)   not null @title: '테넌트ID' ;	
  key company_code                   : String(10)  not null @title: '회사코드' ;	
  key org_type_code                  : String(2)   not null @title: '조직유형코드' ;	
  key org_code                       : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30)  not null @title: '평가유형코드' ;	
  key regular_evaluation_id          : String(100) not null @title: '정기평가ID' ;	
  key vendor_pool_code               : String(20)  not null @title: '협력사풀코드' ;	
  key evaluation_article_group_code  : String(15)  not null @title: '평가항목그룹코드' ;	
      pyear_planning_distrb_score    : Integer              @title: '전년기획배분점수' ;	
      tyear_planning_distrb_score    : Integer              @title: '금년기획배분점수' ;	
      pyear_eng_distrb_score         : Integer              @title: '전년설계배분점수' ;	
      tyear_eng_distrb_score         : Integer              @title: '금년설계배분점수' ;	
      distrb_score_change_flag       : Boolean              @title: '배분점수변경여부' ;	
      approval_number                : String(50)           @title: '품의번호' ;	
}	
extend Se_Eval_Sheet_Distribution_Score with util.Managed;	
