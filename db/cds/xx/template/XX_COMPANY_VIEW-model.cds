
namespace xx;

@cds.persistence.exists
entity Company_View {
    key tenant_id      : String(5);
    key company_code   : String(10);
        company_name   : String(240);
        use_flag       : Boolean;
        currency_code  : String(30);
        currency_name  : String(300);
        country_code   : String(30);
        country_name   : String(300);
        language_code  : String(30);
        language_name  : String(300);
}