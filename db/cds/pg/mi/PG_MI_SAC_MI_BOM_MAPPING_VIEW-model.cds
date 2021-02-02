namespace pg;

@cds.persistence.exists

entity Mi_Sac_Mi_Bom_Mapping_View {
    key version                     : String(20)    @title : 'Version';
    key mi_measure                  : String(20)    @title : 'Measure';
        date                        : String(6)     @title : '기준년월';
        latest_mi_date              : String(8)     @title : '최근시황일자';    
        latest_net_price_cfm_date   : String(8)     @title : '최근단가결정일자';
    key tenant                      : String(5)     @title : '터넌트ID';
    key bizunit                     : String(10)    @title : '사업본부코드';
    key vendor_pool                 : String(40)    @title : '협력사풀코드';
    key material                    : String(40)    @title : '자재코드';
    key supplier                    : String(10)    @title : '공급업체코드';
        source_currency             : String(1)     @title : '통화코드';
        uom                         : String(1)     @title : '단위코드';
        mi_material                 : String(40)    @title : '시황자재코드';
        mi_incoterms                : String(1)     @title : '인도조건코드';
        exchange                    : String(1)     @title : '거래소코드';
        net_price_confirmed_type    : String(1)     @title : '단가결정시점유형';
        target_currency             : String(1)     @title : '현지통화코드';
        plant                       : String(10)     @title : '플랜트';
        value                       : Integer       @title : 'Value';
}