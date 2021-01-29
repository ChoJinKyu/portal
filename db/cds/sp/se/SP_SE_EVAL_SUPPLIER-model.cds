namespace sp;	
using util from '../../cm/util/util-model';
	
entity Se_Eval_Supplier {	
  key tenant_id           : String(5)   not null @title: '테넌트ID' ;	
  key company_code        : String(10)  not null @title: '회사코드' ;	
  key supplier_code       : String(10)  not null @title: '공급업체코드' ;	
      supplier_group_code : String(30)           @title: '공급업체그룹코드' ;	
      supplier_group_name : String(50)           @title: '공급업체그룹명' ;	
      repr_supplier_flag  : Boolean              @title: '대표공급업체여부' ;	
}	
extend Se_Eval_Supplier with util.Managed;