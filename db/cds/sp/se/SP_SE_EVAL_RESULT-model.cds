namespace sp;	
using util from '../../cm/util/util-model';	
	
entity Se_Eval_Result {	
  key tenant_id                      : String(5)   not null @title: '테넌트ID' ;	
  key company_code                   : String(10)  not null @title: '회사코드' ;	
  key org_type_code                  : String(2)   not null @title: '조직유형코드' ;	
  key org_code                       : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30)  not null @title: '평가유형코드' ;	
  key regular_evaluation_id          : String(100) not null @title: '정기평가ID' ;	
  key supplier_group_code            : String(30)  not null @title: '공급업체그룹코드' ;	
      evaluation_score               : Decimal(5,2)         @title: '평가점수' ;	
      evaluation_grade               : String(10)           @title: '평가등급' ;	
      evaluation_person_info         : String(100)          @title: '평가담당자정보' ;	
      appeal_flag                    : Boolean              @title: '이의제기여부' ;	
      appeal_reason                  : String(1000)         @title: '이의제기사유' ;	
      vendor_pool_internal_rank      : Decimal              @title: '협력사풀내부순위' ;	
      full_rank                      : Decimal              @title: '전체순위' ;	
}	
extend Se_Eval_Result with util.Managed;	
