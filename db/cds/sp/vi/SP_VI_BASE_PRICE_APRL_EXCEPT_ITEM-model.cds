namespace sp;	

using util from '../../cm/util/util-model';

entity Vi_Base_Price_Aprl_Except_Item {	
  key tenant_id                        : String(5)   not null;	
  key approval_number                  : String(50)  not null;	
  key item_sequence                    : String(50)  not null;	
      company_code                     : String(10)  ;	
      bizunit_code                     : String(10)  ;	
      base_year                        : String(4)   ;	
      apply_start_yyyymm               : String(6)   ;	
      apply_end_yyyymm                 : String(6)   ;	
      bizdivision_code                 : String(10)  ;	
      plant_code                       : String(10)  ;	
      supplier_code                    : String(10)  ;	
      material_code                    : String(40)  ;	
      material_name                    : String(240) ;	
      vendor_pool_code                 : String(20)  ;	
      currency_code                    : String(3)   ;	
      base_price_exception_reason      : String(300)  ;	
      apply_flag                       : String(1)   ;	   	
} ;	

extend Vi_Base_Price_Aprl_Except_Item with util.Managed;

annotate Vi_Base_Price_Aprl_Except_Item with @title : '양산가 품의 제외 ITEM'  @description : '양산가 품의 제외ITEM';

annotate Vi_Base_Price_Aprl_Except_Item with {
    tenant_id                         @title : '테넌트ID'        @description      : '테넌트ID';
    approval_number                   @title : '품의번호'         @description     : '품의번호';
    item_sequence                     @title : '품목순번'         @description     : '품목순번';
    company_code                      @title : '회사코드'         @description     : '회사코드';	
	bizunit_code                      @title : '본부코드'         @description     : '본부코드';	
    base_year                         @title : '기준년도'         @description     : '기준년도';
    apply_start_yyyymm                @title : '적용시작년월'     @description      : '적용시작년월';
    apply_end_yyyymm                  @title : '적용종료년월'     @description      : '적용종료년월';
    bizdivision_code                  @title : '사업부코드'       @description      : '사업부코드';
    plant_code                        @title : '플랜트코드'       @description      : '플랜트코드';
    supplier_code                     @title : '공급업체코드'     @description      : '기준일자';
    material_code                     @title : '자재코드'         @description      : '자재코드';
    material_name                     @title : '자재명'           @description      : '자재명';
    vendor_pool_code                  @title : '벤더풀코드'       @description      : '벤더풀코드';
    currency_code                     @title : '통화코드'         @description      : '통화코드';
    exception_reason                  @title : '예외사유'         @description      : '예외사유';
    apply_flag                        @title : '적용여부'         @description      : '적용여부'; 
};


