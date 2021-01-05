namespace sp;	
using util from '../../cm/util/util-model';
	
entity Se_Eval_Item_Opt {	
  key tenant_id                      : String(5)   not null @title: '테넌트ID' ;	
  key company_code                   : String(10)  not null @title: '회사코드' ;	
  key org_type_code                  : String(2)   not null @title: '조직유형코드' ;	
  key org_code                       : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30)  not null @title: '평가유형코드' ;	
  key evaluation_article_code        : String(15)  not null @title: '평가항목코드' ;	
  key option_article_number          : String(10)  not null @title: '선택항목번호' ;	
      option_article_name            : String(240)          @title: '선택항목명' ;	
      option_article_start_value     : String(100)          @title: '선택항목시작값' ;	
      option_article_end_value       : String(100)          @title: '선택항목종료값' ;	
      evaluation_score               : Decimal(5,2)         @title: '평가점수' ;	
      sort_sequence                  : Decimal              @title: '정렬순서' ;	
}	
extend Se_Eval_Item_Opt with util.Managed;	
