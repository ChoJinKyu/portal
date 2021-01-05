namespace sp;	
using util from '../../cm/util/util-model';
	
entity Se_Operation_Unit_Map {	
  key tenant_id                       : String(5)  not null @title: '테넌트ID' ;	
  key company_code                    : String(10)  not null @title: '회사코드' ;	
  key org_type_code                   : String(2)  not null @title: '구매운영조직유형' ;	
  key org_code                        : String(10)  not null @title: '구매운영조직코드' ;	
  key evaluation_operation_unit_code  : String(30)  not null @title: '카테고리 코드' ;	
  key vendor_pool_operation_unit_code : String(30)   @title: '협력사풀운영단위코드' ;	
}	
extend Se_Operation_Unit_Map with util.Managed;	
