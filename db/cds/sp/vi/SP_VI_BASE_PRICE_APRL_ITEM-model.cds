namespace sp;	

using util from '../../cm/util/util-model';

entity VI_Base_Price_Aprl_Item {	
     key tenant_id                      : String(5)   not null;	
     key approval_number                : String(50)  not null;	
     key item_sequence                  : Decimal    not null;	
         company_code                   : String(10) not null ;	
         bizunit_code                   : String(10) not null ;	
         management_mprice_code         : String(30) not null ;	
         base_year                      : String(4)  not null ;	
         apply_start_yyyymm             : String(6)  not null ;	
         apply_end_yyyymm               : String(6)  not null ;	
         bizdivision_code               : String(10) not null ;	
         plant_code                     : String(10) not null ;	
         supply_plant_code              : String(10)          ;	
         supplier_code                  : String(10)  not null;	
         material_code                  : String(40)  not null;	
         material_name                  : String(240)         ;
         vendor_pool_code               : String(20)  not null;
         currency_code                  : String(3)   not null;
         base_uom_code                  : String(30)          ;		
         base_price                     : Decimal(19,4)       ;	
         buyer_empno                    : String(30)          ;	
         pcst                           : Decimal(19,4)             ;	
         metal_net_price                : Decimal(19,4)             ;	
         coating_mat_net_price          : Decimal(19,4)             ;	
         fabric_net_price               : Decimal(19,4)             ;	
        
};

extend VI_Base_Price_Aprl_Item with util.Managed;

annotate VI_Base_Price_Aprl_Item with @title : '양산가 품의 ITEM'  @description : '양산가 품의 ITEM';

annotate VI_Base_Price_Aprl_Item with {
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
    supply_plant_code                 @title : '공급플랜트코드'   @description      : '공급플랜트코드';
    supplier_code                     @title : '공급업체코드'     @description      : '기준일자';
    material_code                     @title : '자재코드'         @description      : '자재코드';
    material_name                     @title : '자재명'           @description      : '자재명';
    vendor_pool_code                  @title : '벤더풀코드'       @description      : '벤더풀코드';
    currency_code                     @title : '통화코드'         @description      : '통화코드';
    base_uom_code                     @title : '단위'         @description          : '단위'; 
    buyer_empno                       @title : '구매담당자사번'    @description      : '구매담당자사번';
    base_price                        @title : '기준단가'         @description      : '기준단가';
    pcst                              @title : '가공비'           @description      : '가공비';
    metal_net_price                   @title : '메탈단가'         @description       : '메탈단가';
    coating_mat_net_price             @title : '코팅재단가'       @description       : '코팅재단가';
    fabric_net_price                  @title : '원단단가'         @description       : '원단단가';
   
};
