namespace sp;	
using util from '../../cm/util/util-model';
	
entity Se_Eval_Result_Item_Group {	
  key tenant_id                      : String(5)   not null @title: '테넌트ID' ;	
  key company_code                   : String(10)  not null @title: '회사코드' ;	
  key org_type_code                  : String(2)   not null @title: '조직유형코드' ;	
  key org_code                       : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30)  not null @title: '평가유형코드' ;	
  key regular_evaluation_id          : String(100) not null @title: '정기평가ID' ;	
  key supplier_group_code            : String(30)  not null @title: '공급업체그룹코드' ;	
  key evaluation_article_group_code  : String(15)  not null @title: '평가항목그룹코드' ;	
      evaluation_score               : Integer              @title: '평가점수' ;	
}	
extend Se_Eval_Result_Item_Group with util.Managed;	