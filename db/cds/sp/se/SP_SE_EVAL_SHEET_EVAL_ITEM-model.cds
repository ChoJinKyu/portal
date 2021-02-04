namespace sp;	
using util from '../../cm/util/util-model';
	
entity Se_Eval_Sheet_Eval_Item {	
  key tenant_id                       : String(5)    not null @title: '테넌트ID' ;	
  key company_code                    : String(10)   not null @title: '회사코드' ;	
  key org_type_code                    : String(2)   not null @title: '조직유형코드' ;	
  key org_code                         : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code   : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code             : String(30)  not null @title: '평가유형코드' ;	
  key regular_evaluation_id            : String(100) not null @title: '정기평가ID' ;	
  key evaluation_article_code          : String(15)  not null @title: '평가항목코드' ;
      evaluation_article_name          : String(240)          @title: '평가항목명' ;	
      parent_evaluation_article_code   : String(15)           @title: '상위평가항목코드' ;
      evaluation_distrb_score_weight   : Decimal(5,2)         @title: '평가배점가중치' ;	
      evaluation_execute_mode_code     : String(30)           @title: '평가실행방식코드' ;	
      evaluation_article_type_code     : String(30)           @title: '평가항목구분코드' ;	
      evaluation_distrb_scr_type_cd    : String(30)           @title: '평가배점유형코드' ;	
      evaluation_result_input_type_cd  : String(30)           @title: '평가결과입력유형코드' ;	
      qttive_item_uom_code             : String(3)            @title: '정량항목측정단위코드' ;	
      qttive_eval_article_calc_formula : String(1000)         @title: '정량평가항목계산공식' ;	
      evaluation_article_desc          : String(3000)         @title: '평가항목설명' ;	
      evaluation_article_lvl_attr_cd   : String(30)           @title: '평가항목레벨속성코드' ;
      sort_sequence                    : Decimal              @title: '정렬순서';	
}	
extend Se_Eval_Sheet_Eval_Item with util.Managed;	
