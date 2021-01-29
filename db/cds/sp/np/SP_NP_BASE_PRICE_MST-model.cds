namespace sp;
using util from '../../cm/util/util-model';
// using {sp as netPrice} from '../netPrice/SP_NP_BASE_PRICE_MST-model';	

entity Np_Base_Price_Mst {
  key tenant_id                  : String(5)               not null   @title: '테넌트ID' ;
  key company_code               : String(10)              not null   @title: '회사코드' ;
  key org_type_code              : String(2)               not null   @title: '구매운영조직유형' ;
  key org_code                   : String(10)              not null   @title: '구매운영조직코드' ;
  key supplier_code              : String(15)              not null   @title: '공급업체코드' ;
  key material_code              : String(40)              not null   @title: '자재코드' ;
  key market_code                : String(30)              not null   @title: '납선코드' ;
  key currency_code              : String(3)               not null   @title: '통화코드' ;
  key effective_start_date       : String(8)               not null   @title: '유효시작일자' ;
      effective_end_date         : String(8)                          @title: '유효종료일자' ;
      base_price                 : Decimal                 not null   @title: '기준단가 ' ;
      base_price_type_code       : String(30)                         @title: '기준단가유형코드' ;
      use_flag                   : Boolean                            @title: '사용여부' ;
}
extend Np_Base_Price_Mst with util.Managed;