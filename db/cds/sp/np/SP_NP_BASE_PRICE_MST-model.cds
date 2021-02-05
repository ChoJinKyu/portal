namespace sp;
using util from '../../cm/util/util-model';

entity Np_Base_Price_Mst {	
  key tenant_id             : String(5)      not null    @title: '테넌트ID' ;	
  key base_price_id         : Integer64      not null    @title: '기준단가ID' ;	
      company_code          : String(10)     not null    @title: '회사코드' ;	
      org_type_code         : String(2)      not null    @title: '구매운영조직유형' ;	
      org_code              : String(10)     not null    @title: '구매운영조직코드' ;	  
      material_code         : String(40)     not null    @title: '자재코드' ;
      supplier_code         : String(15)     not null    @title: '공급업체코드' ;
      market_code           : String(30)     not null    @title: '납선코드' ;	
      currency_code         : String(3)      not null    @title: '통화코드' ;	
      base_date             : Date                       @title: '기준일자' ;	
      apply_year            : String(4)                  @title: '적용년도' ;	
      apply_start_yyyymm    : String(6)                  @title: '적용시작년월' ;	
      apply_end_yyyymm      : String(6)                  @title: '적용종료년월' ;	
      base_price            : Decimal(34,10) not null    @title: '기준단가 ' ;	
      base_price_type_code  : String(30)                 @title: '기준단가유형코드' ;	
      pcst                  : Decimal(34,10)             @title: '가공비' ;	
      metal_net_price       : Decimal(34,10)             @title: '메탈단가' ;	
      fabric_net_price      : Decimal(34,10)             @title: '원단단가' ;	
      coating_mat_net_price : Decimal(34,10)             @title: '코팅재단가' ;	
      use_flag              : Boolean                    @title: '사용여부' ;	
}	

extend Np_Base_Price_Mst with util.Managed;