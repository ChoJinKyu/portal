namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Quotation_Dtl_View {

    key tenant_id                       : String(5) not null     @title : '테넌트ID';
    key company_code                    : String(10) not null    @title : '회사코드';
    key const_quotation_number          : String(30) not null    @title : '공사견적번호';
    key const_quotation_item_number     : String(50) not null    @title : '공사견적품목번호';
        item_sequence                   : Decimal                @title : '품목순번';
        ep_item_code                    : String(50)             @title : '설비공사용품목코드';
        item_desc                       : String(200)            @title : '품목내역';
        spec_desc                       : String(1000)           @title : '규격설명';
        quotation_quantity              : Decimal                @title : '견적수량';
        extra_rate                      : Decimal                @title : '할증비율';
        unit                            : String(3)              @title : '단위';
        currency_code                   : String(15)             @title : '통화코드';
        currency_name                   : String(15)             @title : '통화';
        material_apply_flag             : Boolean                @title : '자재적용여부';
        labor_apply_flag                : Boolean                @title : '노무적용여부';
        net_price_change_allow_flag     : Boolean                @title : '단가변경허용여부';
        base_material_net_price         : Decimal                @title : '기준자재단가';
        base_labor_net_price            : Decimal                @title : '기준노무단가';
        material_net_price              : Decimal                @title : '자재단가';
        material_amount                 : Decimal                @title : '자재금액';
        labor_net_price                 : Decimal                @title : '노무단가'; 
        labor_amount                    : Decimal                @title : '노무금액';
        sum_amount                      : Decimal                @title : '합계금액';
        remark                          : String(3000)           @title : '비고';
        net_price_contract_document_no  : String(50)             @title : '단가계약그룹번호';
        net_price_contract_degree       : Integer64              @title : '차수';
        net_price_contract_item_number  : String(50)             @title : '단가계약품목번호';
        supplier_item_create_flag       : Boolean                @title : '공급업체품목생성여부';

}

extend Uc_Quotation_Dtl_View with util.Managed;