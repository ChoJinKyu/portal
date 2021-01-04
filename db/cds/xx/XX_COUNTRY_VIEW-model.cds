namespace xx;

@cds.persistence.exists
entity Country_View {
    key tenant_id          : String(5);
    key country_code       : String(30);
    key language_code      : String(30);
        country_name       : String(30);
        description        : String(300);
        language           : String(300);
        iso_code           : String(30);
        eu_code            : String(30);
        date_format_code   : String(30);
        number_format_code : String(30);
        currency_code      : String(30);
}