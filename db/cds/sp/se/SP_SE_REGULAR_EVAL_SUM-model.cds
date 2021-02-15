namespace sp;	
using util from '../../cm/util/util-model'; 
	
entity Se_Regular_Eval_Sum {	
  key tenant_id                      : String(5)   not null @title: '테넌트ID' ;	
  key company_code                   : String(10)  not null @title: '회사코드' ;	
  key org_type_code                  : String(2)   not null @title: '조직유형코드' ;	
  key org_code                       : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30)  not null @title: '평가유형코드' ;	
  key regular_evaluation_id          : String(100) not null @title: '정기평가ID' ;	
      regular_evaluation_year        : String(4)            @title: '정기평가년도' ;	
      regular_evaluation_period_code : String(30)           @title: '정기평가기간코드' ;	
      regular_evaluation_name        : String(240)          @title: '정기평가명' ;	
      regular_eval_prog_status_cd    : String(30)           @title: '정기평가진행상태코드' ;	
      actual_aggregate_start_date    : String(8)            @title: '실적집계시작일자' ;	
      actual_aggregate_end_date      : String(8)            @title: '실적집계종료일자' ;	
      regular_evaluation_exec_str_dt : String(8)            @title: '정기평가실행시작일자' ;	
      regular_evaluation_exec_end_dt : String(8)            @title: '정기평가실행종료일자' ;	
}	
extend Se_Regular_Eval_Sum with util.Managed;	
