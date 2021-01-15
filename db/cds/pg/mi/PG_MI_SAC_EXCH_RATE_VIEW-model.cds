namespace pg;

@cds.persistence.exists

entity Mi_Sac_Exch_Rate_View {
    key tenant_id                   : String(5)         @title : '테넌트ID';
    key source_currency_code        : String(8)         @title : '소스통화코드';
    key target_currency_code        : String(8)         @title : '대상통화코드';
    key date                        : String(6)         @title : '기준월';
        mi_measure                  : Decimal(20,10)    @title : '지표 목록';
}