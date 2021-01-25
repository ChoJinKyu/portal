namespace cm;

@cds.persistence.exists
entity Currency_View {
    key tenant_id            : String(5);
    key language_code        : String(30);
    key currency_code        : String(30);
        currency_code_name   : String(240);
        effective_start_date : DateTime;
        effective_end_date   : DateTime;
        use_flag             : Boolean;
        scale                : Decimal;
        extension_scale      : Decimal;
        currency_prefix      : String(30);
        currency_suffix      : String(30);
}