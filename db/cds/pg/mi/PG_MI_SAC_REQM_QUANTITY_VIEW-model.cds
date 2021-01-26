namespace pg;

@cds.persistence.exists

entity Mi_Sac_Reqm_Quantity_View {
    key version                     : String(20)        @title : 'Version';
    key tenant                      : String(5)         @title : '터넌트ID';
    key bizunit                     : String(10)        @title : '사업본부코드';
    key vendor_pool                 : String(40)        @title : '협력사풀코드';
    key material                    : String(40)        @title : '자재코드';
    key supplier                    : String(10)        @title : '공급업체코드';
        date                        : String(6)         @title : '기준년월';
        latest_mi_date              : String(8)         @title : '최근시황일자';    
        latest_net_price_cfm_date   : String(8)         @title : '최근단가결정일자';
        source_currency             : String(8)         @title : '소스통화';
        target_currency             : String(8)         @title : '대상통화';
        uom                         : String(10)        @title : '측정단위';
    key mi_material                 : String(40)        @title : '시황자재';
    key mi_incoterms                : String(30)        @title : '인도조건';
    key exchange                    : String(30)        @title : '거래소';
    key net_price_confirmed_type    : String(20)        @title : '단가결정시점유형';
        plant                       : String(10)        @title : '플랜트';
    key mi_measure                  : String(20)        @title : 'Measure';
        value                       : Decimal(28, 10)    @title : 'Value';
}