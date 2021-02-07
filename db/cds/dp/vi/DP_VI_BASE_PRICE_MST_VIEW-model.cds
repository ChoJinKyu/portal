namespace dp;

@cds.persistence.exists
entity VI_Base_Price_Mst_View {
    key tenant_id                  : String(5) not null;
    key company_code               : String(10) not null;
    key org_type_code              : String(2) not null;
    key org_code                   : String(10) not null;
    key material_code              : String(40) not null;
    key supplier_code              : String(10) not null;
        nn_net_price               : Decimal(34,10);
        nn_currency_code           : String(3);
        nn_start_date              : Date;
        nb_base_price              : Decimal(34,10);
        nb_currency_code           : String(3);
        nb_base_date               : Date;
        vb_base_price              : Decimal(34,10);
        vb_currency_code           : String(3);
        vb_base_date               : Date;
        first_purchasing_net_price : Decimal(34,10);
        first_pur_netprice_curr_cd : String(3);
        first_pur_netprice_str_dt  : Date;
}

annotate VI_Base_Price_Mst_View with @title : '개발기준단가'  @description : '개발기준단가';

annotate VI_Base_Price_Mst_View with {
    tenant_id                  @title : '테넌트ID'  @description      : '테넌트ID';
    company_code               @title : '회사코드'  @description       : '회사코드';
    org_type_code              @title : '조직유형코드'  @description     : '조직유형코드';
    org_code                   @title : '조직코드'  @description       : '조직코드';
    material_code              @title : '자재코드'  @description       : '자재코드';
    supplier_code              @title : '공급업체코드'  @description     : '공급업체코드';
    nn_net_price               @title : '구매단가'  @description       : '구매단가';
    nn_currency_code           @title : '구매단가통화코드'  @description   : '구매단가통화코드';
    nn_start_date              @title : '구매기준일자'  @description     : '구매기준일자';
    nb_base_price              @title : '양산기준단가'  @description     : '양산기준단가';
    nb_currency_code           @title : '양산기준단가통화코드'  @description : '양산기준단가통화코드';
    nb_base_date               @title : '양산기준일자'  @description     : '양산기준일자';
    vb_base_price              @title : '개발기준단가'  @description     : '개발기준단가';
    vb_currency_code           @title : '개발기준단가통화코드'  @description : '개발기준단가통화코드';
    vb_base_date               @title : '개발기준일자'  @description     : '개발기준일자';
    first_purchasing_net_price @title : '최초구매단가'  @description     : '최초구매단가';
    first_pur_netprice_curr_cd @title : '최초구매단가통화코드'  @description : '최초구매단가통화코드';
    first_pur_netprice_str_dt  @title : '최초구매시작일자'  @description   : '최초구매시작일자';
};
