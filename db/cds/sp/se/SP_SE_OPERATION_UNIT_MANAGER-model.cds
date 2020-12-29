namespace sp;	
using util from '../../cm/util/util-model';  
	
entity Se_Operation_Unit_Manager {	
  key tenant_id                      : String(5)  not null @title: '테넌트ID' ;	
  key company_code                   : String(10) not null @title: '회사코드' ;	
  key org_type_code                  : String(2)  not null @title: '구매운영조직유형' ;	
  key org_code                       : String(10) not null @title: '구매운영조직코드' ;	
  key evaluation_operation_unit_code : String(30) not null @title: '평가운영단위코드' ;	
  key evaluation_op_unt_person_empno : String(30)          @title: '평가운영단위담당자사번' ;	
      evaluation_execute_role_code   : String(30)          @title: '평가실행역할코드' ;	
}	
extend Se_Operation_Unit_Manager with util.Managed;	
