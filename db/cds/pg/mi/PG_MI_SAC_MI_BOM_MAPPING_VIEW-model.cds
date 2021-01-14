namespace pg;

@cds.persistence.exists

entity Mi_Sac_Mi_Bom_Mapping_View {
    key version                     : String(20)    @title : 'Version';
    key mi_measure_code             : String(20)    @title : 'Measure';
        date                        : String(6)     @title : '기준년월';
        latest_mi_date              : String(8)     @title : '최근시황일자';    
        latest_net_price_cfm_date   : String(8)     @title : '최근단가결정일자';
    key tenant_id                   : String(5)     @title : '터넌트ID';
    key bizunit_code                : String(10)    @title : '사업본부코드';
    key vendor_pool_mst             : String(40)    @title : '협력사풀코드';
    key material_code               : String(40)    @title : '자재코드';
    key supplier_code               : String(10)    @title : '공급업체코드';
        currency_code               : String(1)     @title : '통화코드';
        uom_code                    : String(1)     @title : '단위코드';
        mi_material_code            : String(1)     @title : '시황자재코드';
        termsdelv_code              : String(1)     @title : '인도조건코드';
        exchange_code               : String(1)     @title : '거래소코드';
        price_confirmed_code        : String(1)     @title : '단가결정시점유형';
        local_currency_code         : String(1)     @title : '현지통화코드';
        value                       : Integer       @title : 'Value';
}