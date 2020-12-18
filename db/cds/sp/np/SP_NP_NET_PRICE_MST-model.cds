namespace sp;	
using util from '../../cm/util/util-model';
// using {sp as partCategory} from '../netPrice/SP_NP_NET_PRICE_MST-model';	
	
entity Np_Net_Price_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2) default 'PL' not null @title: '구매운영조직유형' ;	
  key org_code : String(10)  not null @title: '구매운영조직코드' ;	
  key net_price_document_type_code : String(30)  not null @title: '단가문서유형코드' ;	
  key net_price_source_code : String(30)  not null @title: '단가출처코드' ;	
  key net_price_sequence : Integer64  not null @title: '단가순번' ;	
  key supplier_code : String(15)  not null @title: '공급업체코드' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	
  key market_code : String(30)  not null @title: '납선코드' ;	
  key effective_start_date : String(8)  not null @title: '유효시작일자' ;	
    effective_end_date : String(8)   @title: '유효종료일자' ;	
    payterms_code : String(30)   @title: '지불조건코드' ;	
    incoterms : String(3)   @title: '인코텀즈' ;	
    buyer_empno : String(30)   @title: '구매담당자사번' ;	
    approve_status_code : String(30)   @title: '결재상태코드' ;	
    approve_date : Date   @title: '결재일자' ;	
    tentprc_flag : Boolean   @title: '가단가여부' ;	
    currency_code : String(3)   @title: '통화코드' ;	
    exrate_type_code : String(3)   @title: '환율유형코드' ;	
    exrate_date : Date   @title: '환율일자' ;	
    exrate : Decimal   @title: '환율' ;	
    approval_excl_flag : Boolean   @title: '승인제외여부' ;	
    erp_pur_netprice_number : Integer64   @title: 'ERP구매단가번호' ;	
    erp_pur_netprice_item_no : Integer64   @title: 'ERP구매단가품목번호' ;	
    erp_pur_netprice_contract_dt : String(3)   @title: 'ERP구매단가계약일자' ;	
    quotation_number : Decimal   @title: '견적번호' ;	
    quotation_sequence : Decimal   @title: '견적순번' ;	
    quotation_item_number : Decimal   @title: '견적품목번호' ;	
    bidding_number : Decimal   @title: '입찰번호' ;	
    bidding_item_number : Decimal   @title: '입찰품목번호' ;	
    line_type_code : String(30)   @title: '라인유형코드' ;	
    material_desc : String(300)   @title: '자재내역' ;	
    uom_code : String(3)   @title: 'UOM코드' ;	
    surrogate_flag : Boolean   @title: '대리견적여부' ;	
    net_price : Decimal  not null @title: '단가' ;	
    purchasing_quantity : Decimal   @title: '구매수량' ;	
    purchasing_amount : Decimal   @title: '구매금액' ;	
    vendor_pool_code : String(20)   @title: '협력사풀코드' ;	
    maker_code : String(10)   @title: '제조사코드' ;	
    agent_name : String(240)   @title: '대행사명' ;	
    net_price_agreement_sign_flag : Boolean   @title: '단가합의서명여부' ;	
    net_price_agreement_status_code : String(30)   @title: '단가합의상태코드' ;	
    pyear_july_base_currency_code : String(3)   @title: '전년7월기준통화코드' ;	
    pyear_july_base_price : Decimal   @title: '전년7월기준단가' ;	
    pyear_july_ci_rate : Decimal   @title: '전년7월CI비율' ;	
    pyear_dec_base_currency_code : String(3)   @title: '전년12월기준통화코드' ;	
    pyear_dec_base_price : Decimal   @title: '전년12월기준단가' ;	
    pyear_dec_ci_rate : Decimal   @title: '전년12월CI비율' ;	
    quarter_base_currency_code : String(3)   @title: '분기기준통화코드' ;	
    quarter_base_price : Decimal   @title: '분기기준단가' ;	
    quarter_ci_rate : Decimal   @title: '분기CI비율' ;	
    base_price_type_code : String(30)   @title: '기준단가유형코드' ;	
    quality_certi_flag : Boolean   @title: '품질인증여부' ;	
    pr_number : String(50)   @title: '구매요청번호' ;	
    pr_item_number : String(10)   @title: '구매요청품목번호' ;	
    material_class_code : String(30)   @title: '자재클래스코드' ;	
    po_unit : String(3)   @title: '구매오더단위' ;	
    material_price_unit : String(3)   @title: '자재가격단위' ;	
    conversion_net_price : Decimal   @title: '환산단가' ;	
    tax_code : String(10)   @title: '세금코드' ;	
    overdlv_tolerance : Decimal   @title: '초과납품허용율' ;	
    hs_code : String(17)   @title: 'HS코드' ;	
    fta_code : String(30)   @title: 'FTA코드' ;	
}	
extend Np_Net_Price_Mst with util.Managed;	