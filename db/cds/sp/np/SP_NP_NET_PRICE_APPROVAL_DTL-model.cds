namespace sp;
using util from '../../cm/util/util-model';
// using {sp as netPrice} from '../netPrice/SP_NP_NET_PRICE_APPROVAL_DTL-model';	
	
entity Np_Net_Price_Approval_Dtl {
  key tenant_id                       : String(5)   not null   @title: '테넌트ID' ;	
  key company_code                    : String(10)  not null   @title: '회사코드' ;
  key org_type_code                   : String(2)   not null   @title: '구매운영조직유형' ;
  key org_code                        : String(10)  not null   @title: '구매운영조직코드' ;
  key approval_number                 : String(50)  not null   @title: '품의번호' ;	
  key item_sequence                   : Integer64   not null   @title: '품목순번' ;	
      quotation_number                : Integer64              @title: '견적번호' ;	
      quotation_item_number           : Integer64              @title: '견적품목번호' ;	
      bidding_number                  : Integer64              @title: '입찰번호' ;	
      bidding_item_number             : Integer64              @title: '입찰품목번호' ;	
      line_type_code                  : String(30)             @title: '라인유형코드' ;	
      material_code                   : String(40)             @title: '자재코드' ;	
      material_desc                   : String(300)            @title: '자재내역' ;	
      uom_code                        : String(3)              @title: 'UOM코드' ;	
      payterms_code                   : String(30)             @title: '지불조건코드' ;	
      supplier_code                   : String(10)             @title: '공급업체코드' ;	
      effective_start_date            : Date                   @title: '유효시작일자' ;	
      effective_end_date              : Date                   @title: '유효종료일자' ;	
      surrogate_type_code             : String(30)             @title: '대리견적유형코드' ;	
      currency_code                   : String(3)              @title: '통화코드' ;	
      net_price                       : Decimal(34,10)         @title: '단가' ;	
      purchasing_quantity             : Decimal(34,10)         @title: '구매수량' ;	
      purchasing_amount               : Decimal(34,10)         @title: '구매금액' ;	
      vendor_pool_code                : String(20)             @title: '협력사풀코드' ;	
      market_code                     : String(30)             @title: '납선코드' ;	
      net_price_approval_reason_code  : String(30)             @title: '단가품의사유코드' ;	
      maker_code                      : String(10)             @title: '제조사코드' ;	
      agent_code                      : String(30)             @title: '대행사코드' ;	
      net_price_agreement_sign_flag   : Boolean                @title: '단가합의서명여부' ;	
      net_price_agreement_status_code : String(30)             @title: '단가합의상태코드' ;	
      pyear_july_base_currency_code   : String(3)              @title: '전년7월기준통화코드' ;	
      pyear_july_base_price           : Decimal(34,10)         @title: '전년7월기준단가' ;	
      pyear_july_ci_rate              : Decimal(34,10)         @title: '전년7월CI비율' ;	
      pyear_dec_base_currency_code    : String(3)              @title: '전년12월기준통화코드' ;	
      pyear_dec_base_price            : Decimal(34,10)         @title: '전년12월기준단가' ;	
      pyear_dec_ci_rate               : Decimal(34,10)         @title: '전년12월CI비율' ;	
      quarter_base_currency_code      : String(3)              @title: '분기기준통화코드' ;	
      quarter_base_price              : Decimal(34,10)         @title: '분기기준단가' ;	
      quarter_ci_rate                 : Decimal(34,10)         @title: '분기CI비율' ;	
      base_price_type_code            : String(30)             @title: '기준단가유형코드' ;	
      quality_certi_flag              : Boolean                @title: '품질인증여부' ;	
      exrate_type_code                : String(30)             @title: '환율유형코드' ;	
      exrate_date                     : Date                   @title: '환율일자' ;	
      exrate                          : Decimal(34,10)         @title: '환율' ;	
      pr_number                       : String(50)             @title: '구매요청번호' ;	
      pr_item_number                  : String(10)             @title: '구매요청품목번호' ;	
      material_class_code             : String(30)             @title: '자재클래스코드' ;	
      po_unit                         : String(3)              @title: '구매오더단위' ;	
      material_price_unit             : String(3)              @title: '자재가격단위' ;	
      conversion_net_price            : Decimal(34,10)         @title: '환산단가' ;	
      net_price_type_code             : String(30)             @title: '단가유형코드' ;	
      contract_date                   : String(8)              @title: '계약일자' ;	
      incoterms                       : String(3)              @title: '인코텀즈' ;	
      incoterms_2                     : String(3)              @title: '인코텀즈2' ;	
      tax_code                        : String(10)             @title: '세금코드' ;	
      overdlv_tolerance               : Decimal(34,10)         @title: '초과납품허용율' ;	
      hs_code                         : String(17)             @title: 'HS코드' ;	
      fta_code                        : String(30)             @title: 'FTA코드' ;	
}
extend Np_Net_Price_Approval_Dtl with util.Managed;	