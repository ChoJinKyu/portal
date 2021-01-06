namespace dp;

@cds.persistence.exists
entity Dp_Tc_Project_Base_Exrate_Type {
    key tenant_id     : String(5) not null  @title : '테넌트ID';
    key project_code  : String(30) not null @title : '프로젝트코드';
    key model_code    : String(40) not null @title : '모델코드';
    key currency_code : String(3) not null  @title : '통화코드';
    key period_code   : String(30) not null @title : '기간코드';
        exrate        : Decimal             @title : '환율';
}
