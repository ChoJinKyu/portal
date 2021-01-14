namespace sp;	
using util from '../../cm/util/util-model'; 
	
entity Se_Quantitative_Item {	
  key tenant_id                      : String(5)  not null @title: '테넌트ID' ;	
  key company_code                   : String(10) not null @title: '회사코드' ;	
  key org_type_code                  : String(2)  not null @title: '조직유형코드' ;	
  key org_code                       : String(10) not null @title: '조직코드' ;	
  key evaluation_operation_unit_code : String(30) not null @title: '평가운영단위코드' ;	
  key qttive_item_code               : String(15) not null @title: '정량항목코드' ;	
      qttive_item_name               : String(240)         @title: '정량항목명' ;	
      qttive_item_uom_code           : String(30)          @title: '정량항목측정단위코드' ;	
      qttive_item_measure_mode_code  : String(50)          @title: '정량항목측정방식' ;
      qttive_item_desc               : String(1000)        @title: '정량항목설명' ;
      sort_sequence                  : Decimal             @title: '정렬순서';
}	
extend Se_Quantitative_Item with util.Managed;	
