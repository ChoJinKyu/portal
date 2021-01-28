namespace sp;
using util from '../../cm/util/util-model';
// using {sp as netPrice} from '../netPrice/SP_NP_NET_PRICE_APPROVAL_MST-model';	
	
entity Np_Net_Price_Approval_Mst {	
  key tenent_id                       : String(5)    not null  @title: 'L1100' ;	
  key company_code                    : String(10)   not null  @title: '*,LGEKR' ;	
  key operation_type                  : String(10)   not null  @title: 'operating unit' ;	
  key operation_code                  : String(10)   not null  @title: 'operating code' ;	
  key approval_number                 : String(50)   not null  @title: '품의번호' ;	
      approval_title                  : String(300)            @title: '품의제목' ;	
      net_price_document_type_code    : String(30)             @title: '단가문서유형코드' ;	
      net_price_source_code           : String(30)             @title: '견적번호' ;	
      quotation_number                : Decimal                @title: '견적번호' ;	
      quotation_sequence              : Decimal                @title: '견적순번' ;	
      bidding_type_code               : String(30)             @title: '입찰유형코드' ;	
      buyer_empno                     : String(30)             @title: '구매담당자사번' ;	
      effective_start_date            : Date                   @title: '유효시작일자' ;	
      effective_end_date              : Date                   @title: '유효종료일자' ;	
      tentprc_flag                    : Boolean                @title: '가단가여부' ;	
      requestor_empno                 : String(30)             @title: '요청자사번' ;	
      approval_contents               : LargeBinary            @title: '품의내용' ;	
      base_price_input_flag           : Boolean                @title: '기준단가입력여부' ;	
      approval_excl_flag              : Boolean                @title: '승인제외여부' ;
}	
extend Np_Net_Price_Approval_Mst with util.Managed;