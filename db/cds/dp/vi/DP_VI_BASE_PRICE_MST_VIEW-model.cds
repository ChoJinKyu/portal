namespace dp;

@cds.persistence.exists
entity VI_Base_Price_Mst_View {
    key tenant_id                    : String(5) not null;
    key company_code                 : String(10) not null;
    key org_type_code                : String(2) not null;
    key org_code                     : String(10) not null;
    key material_code                : String(40) not null;
    key supplier_code                : String(10) not null;
        nn_net_price_0               : Decimal(34, 10);
        nn_currency_code_0           : String(3);
        nn_start_date_0              : Date;
        nb_base_price_0              : Decimal(34, 10);
        nb_currency_code_0           : String(3);
        nb_base_date_0               : Date;
        vb_base_price_0              : Decimal(34, 10);
        vb_currency_code_0           : String(3);
        vb_base_date_0               : Date;
        first_purchasing_net_price_0 : Decimal(34, 10);
        first_pur_netprice_curr_cd_0 : String(3);
        first_pur_netprice_str_dt_0  : Date;

        nn_net_price_1               : Decimal(34, 10);
        nn_currency_code_1           : String(3);
        nn_start_date_1              : Date;
        nb_base_price_1              : Decimal(34, 10);
        nb_currency_code_1           : String(3);
        nb_base_date_1               : Date;
        vb_base_price_1              : Decimal(34, 10);
        vb_currency_code_1           : String(3);
        vb_base_date_1               : Date;
        first_purchasing_net_price_1 : Decimal(34, 10);
        first_pur_netprice_curr_cd_1 : String(3);
        first_pur_netprice_str_dt_1  : Date;

        nn_net_price_2               : Decimal(34, 10);
        nn_currency_code_2           : String(3);
        nn_start_date_2              : Date;
        nb_base_price_2              : Decimal(34, 10);
        nb_currency_code_2           : String(3);
        nb_base_date_2               : Date;
        vb_base_price_2              : Decimal(34, 10);
        vb_currency_code_2           : String(3);
        vb_base_date_2               : Date;
        first_purchasing_net_price_2 : Decimal(34, 10);
        first_pur_netprice_curr_cd_2 : String(3);
        first_pur_netprice_str_dt_2  : Date;
}

annotate VI_Base_Price_Mst_View with @title : '개발기준단가'  @description : '개발기준단가';

annotate VI_Base_Price_Mst_View with {
    tenant_id                    @title : '테넌트ID'  @description      : '테넌트ID';
    company_code                 @title : '회사코드'  @description       : '회사코드';
    org_type_code                @title : '조직유형코드'  @description     : '조직유형코드';
    org_code                     @title : '조직코드'  @description       : '조직코드';
    material_code                @title : '자재코드'  @description       : '자재코드';
    supplier_code                @title : '공급업체코드'  @description     : '공급업체코드';

    nn_net_price_0               @title : '구매단가_공통'  @description       : '구매단가_공통';
    nn_currency_code_0           @title : '구매단가통화코드_공통'  @description   : '구매단가통화코드_공통';
    nn_start_date_0              @title : '구매기준일자_공통'  @description     : '구매기준일자_공통';
    nb_base_price_0              @title : '양산기준단가_공통'  @description     : '양산기준단가_공통';
    nb_currency_code_0           @title : '양산기준단가통화코드_공통'  @description : '양산기준단가통화코드_공통';
    nb_base_date_0               @title : '양산기준일자_공통'  @description     : '양산기준일자_공통';
    vb_base_price_0              @title : '개발기준단가_공통'  @description     : '개발기준단가_공통';
    vb_currency_code_0           @title : '개발기준단가통화코드_공통'  @description : '개발기준단가통화코드_공통';
    vb_base_date_0               @title : '개발기준일자_공통'  @description     : '개발기준일자_공통';
    first_purchasing_net_price_0 @title : '최초구매단가_공통'  @description     : '최초구매단가_공통';
    first_pur_netprice_curr_cd_0 @title : '최초구매단가통화코드_공통'  @description : '최초구매단가통화코드_공통';
    first_pur_netprice_str_dt_0  @title : '최초구매시작일자_공통'  @description   : '최초구매시작일자_공통';

    nn_net_price_1               @title : '구매단가_수출'  @description       : '구매단가_수출';
    nn_currency_code_1           @title : '구매단가통화코드_수출'  @description   : '구매단가통화코드_수출';
    nn_start_date_1              @title : '구매기준일자_수출'  @description     : '구매기준일자_수출';
    nb_base_price_1              @title : '양산기준단가_수출'  @description     : '양산기준단가_수출';
    nb_currency_code_1           @title : '양산기준단가통화코드_수출'  @description : '양산기준단가통화코드_수출';
    nb_base_date_1               @title : '양산기준일자_수출'  @description     : '양산기준일자_수출';
    vb_base_price_1              @title : '개발기준단가_수출'  @description     : '개발기준단가_수출';
    vb_currency_code_1           @title : '개발기준단가통화코드_수출'  @description : '개발기준단가통화코드_수출';
    vb_base_date_1               @title : '개발기준일자_수출'  @description     : '개발기준일자_수출';
    first_purchasing_net_price_1 @title : '최초구매단가_수출'  @description     : '최초구매단가_수출';
    first_pur_netprice_curr_cd_1 @title : '최초구매단가통화코드_수출'  @description : '최초구매단가통화코드_수출';
    first_pur_netprice_str_dt_1  @title : '최초구매시작일자_수출'  @description   : '최초구매시작일자_수출';

    nn_net_price_2               @title : '구매단가_내수'  @description       : '구매단가_내수';
    nn_currency_code_2           @title : '구매단가통화코드_내수'  @description   : '구매단가통화코드_내수';
    nn_start_date_2              @title : '구매기준일자_내수'  @description     : '구매기준일자_내수';
    nb_base_price_2              @title : '양산기준단가_내수'  @description     : '양산기준단가_내수';
    nb_currency_code_2           @title : '양산기준단가통화코드_내수'  @description : '양산기준단가통화코드_내수';
    nb_base_date_2               @title : '양산기준일자_내수'  @description     : '양산기준일자_내수';
    vb_base_price_2              @title : '개발기준단가_내수'  @description     : '개발기준단가_내수';
    vb_currency_code_2           @title : '개발기준단가통화코드_내수'  @description : '개발기준단가통화코드_내수';
    vb_base_date_2               @title : '개발기준일자_내수'  @description     : '개발기준일자_내수';
    first_purchasing_net_price_2 @title : '최초구매단가_내수'  @description     : '최초구매단가_내수';
    first_pur_netprice_curr_cd_2 @title : '최초구매단가통화코드_내수'  @description : '최초구매단가통화코드_내수';
    first_pur_netprice_str_dt_2  @title : '최초구매시작일자_내수'  @description   : '최초구매시작일자_내수';
};
