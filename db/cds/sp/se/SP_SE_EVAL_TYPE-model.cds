namespace sp;	
using util from '../../cm/util/util-model';  	
// using {sp as categoryClass} from '../standardCommon/SP_SE_EVAL_TYPE-model';	
	
entity Se_Eval_Type {	
  key tenant_id                         : String(5)  not null @title: '테넌트ID' ;	
  key company_code                      : String(10) not null @title: '회사코드' ;	
  key org_type_code                     : String(2)  not null @title: '조직유형코드' ;	
  key org_code                          : String(10) not null @title: '조직코드' ;	
  key evaluation_operation_unit_code    : String(30) not null @title: '평가운영단위코드' ;	
  key evaluation_type_code              : String(30) not null @title: '평가유형코드' ;	
      evaluation_type_name              : String(50)          @title: '평가유형명' ;	
      evaluation_type_distrb_score_rate : Decimal             @title: '평가유형배점비율' ;	
}	
extend Se_Eval_Type with util.Managed;	
