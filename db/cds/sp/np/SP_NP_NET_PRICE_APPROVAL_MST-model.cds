namespace sp;
using util from '../../cm/util/util-model';
using sp   from './SP_NP_NET_PRICE_APPROVAL_DTL-model';
	
entity Np_Net_Price_Approval_Mst {	
  key tenant_id                       : String(5)    not null  @title: 'L1100' ;
  key company_code                    : String(10)   not null  @title: '회사코드' ;
  key org_type_code                   : String(2)    not null  @title: '구매운영조직유형' ;
  key org_code                        : String(10)   not null  @title: '구매운영조직코드' ;
  key approval_number                 : String(50)   not null  @title: '품의번호' ;
      net_price_document_type_code    : String(30)             @title: '단가문서유형코드' ;
      net_price_source_code           : String(30)             @title: '견적번호' ;
      quotation_number                : Decimal                @title: '견적번호' ;
      quotation_sequence              : Decimal                @title: '견적순번' ;
      bidding_type_code               : String(30)             @title: '입찰유형코드' ;
      buyer_empno                     : String(30)             @title: '구매담당자사번' ;
      effective_start_date            : Date                   @title: '유효시작일자' ;
      effective_end_date              : Date                   @title: '유효종료일자' ;
      tentprc_flag                    : Boolean                @title: '가단가여부' ;
      outcome_code                    : String(30)             @title: 'OutCome코드' ;
      nego_number                     : Integer64              @title: 'Nego번호' ;
      base_price_input_flag           : Boolean                @title: '기준단가입력여부' ;
      approval_excl_flag              : Boolean                @title: '승인제외여부' ;

      detailes                        : Association to many    sp.Np_Net_Price_Approval_Dtl    /* Detail 연결 */
                                                            on detailes.tenant_id       = $self.tenant_id 
                                                           and detailes.company_code    = $self.company_code 
                                                           and detailes.org_type_code   = $self.org_type_code
                                                           and detailes.org_code        = $self.org_code
                                                           and detailes.approval_number = $self.approval_number
                                       ;

}	
extend Np_Net_Price_Approval_Mst with util.Managed;