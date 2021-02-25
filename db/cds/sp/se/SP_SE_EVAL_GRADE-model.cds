namespace sp;	
using util from '../../cm/util/util-model';
	
entity Se_Eval_Grade {	
  key tenant_id                      : String(5)  not null @title: '테넌트ID' ;	
  key company_code                   : String(10) not null @title: '회사코드' ;	
  key org_type_code                  : String(2)  not null @title: '조직유형코드' ;	
  key org_code                       : String(10) not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30) not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30) not null @title: '평가유형코드' ;	
  key evaluation_grade               : String(10)          @title: '평가등급' ;	
      evaluation_grade_start_score   : Decimal(6,2)        @title: '평가등급시작점수' ;	
      evaluation_grade_end_score     : Decimal(6,2)        @title: '평가등급종료점수' ;	
      inp_apply_code                 : String(30)          @title: '상벌적용코드' ;	
}	
extend Se_Eval_Grade with util.Managed;	
