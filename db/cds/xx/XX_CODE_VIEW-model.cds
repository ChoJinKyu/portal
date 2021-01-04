namespace xx;

@cds.persistence.exists
entity Code_View {
    key tenant_id         : String(5);
    key group_code        : String(30);
    key code              : String(30);
    key language_code     : String(30);
        language_cd       : String(30);
        code_name         : String(240);
        parent_group_code : String(30);
        parent_code       : String(30);
        start_date        : Date;
        end_date          : Date;
        sort_no           : Decimal;
}
