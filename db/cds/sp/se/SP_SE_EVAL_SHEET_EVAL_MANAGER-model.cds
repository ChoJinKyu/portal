namespace sp;	
using util from '../../cm/util/util-model';
	
entity Se_Eval_Sheet_Eval_Manager {	
  key tenant_id                      : String(5)   not null @title: '테넌트ID' ;	
  key company_code                   : String(10)  not null @title: '회사코드' ;	
  key org_type_code                  : String(2)   not null @title: '조직유형코드' ;	
  key org_code                       : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30)  not null @title: '평가유형코드' ;	
  key regular_evaluation_id          : String(100) not null @title: '정기평가ID' ;	
  key vendor_pool_code               : String(20)  not null @title: '협력사풀코드' ;	
  key evaluation_article_code        : String(15)  not null @title: '평가항목코드' ;	
  key evaluation_person_empno        : String(30)  not null @title: '평가담당자사번' ;	
      person_confirm_flag            : Boolean              @title: '담당자확인여부' ;	
}	
extend Se_Eval_Sheet_Eval_Manager with util.Managed;	