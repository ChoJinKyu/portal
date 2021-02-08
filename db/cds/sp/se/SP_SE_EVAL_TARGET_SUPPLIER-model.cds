namespace sp;	
using util from '../../cm/util/util-model';  

entity Se_Eval_Target_Supplier {	
  key tenant_id                      : String(5)   not null @title: '테넌트ID' ;	
  key company_code                   : String(10)  not null @title: '회사코드' ;	
  key org_type_code                  : String(2)   not null @title: '조직유형코드' ;	
  key org_code                       : String(10)  not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30)  not null @title: '평가운영단위코드' ;	
  key evaluation_type_code           : String(30)  not null @title: '평가유형코드' ;	
  key regular_evaluation_id          : String(100) not null @title: '정기평가ID' ;	
  key supplier_group_code            : String(30)  not null @title: '공급업체그룹코드' ;	
      supplier_type_code             : String(30)           @title: '공급업체유형코드' ;	
      purchasing_amount              : Decimal              @title: '구매금액' ;	
      delivery_quantity              : Decimal              @title: '납품수량' ;	
      person_confirm_flag            : Boolean              @title: '담당자확인여부' ;	
      evaluation_excl_flag           : Boolean              @title: '평가제외여부' ;	
      evaluation_excl_reason         : String(1000)         @title: '평가제외사유' ;
      vendor_pool_code               : String(20)           @title: '협력사풀코드' ;
      vendor_pool_path_name          : String(500)          @title: '협력사풀경로명' ;
}
extend Se_Eval_Target_Supplier with util.Managed;	
