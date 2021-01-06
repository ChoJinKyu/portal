namespace dp;

@cds.persistence.exists
entity Dp_Tc_Project_Similar_Model_Type {
    key tenant_id            : String(5) not null  @title : '테넌트ID';
    key project_code         : String(30) not null @title : '프로젝트코드';
    key model_code           : String(40) not null @title : '모델코드';
    key similar_model_code   : String(40) not null @title : '유사모델코드';
        code_desc            : String(300)         @title : '코드설명';
        direct_register_flag : Boolean             @title : '직접등록여부';
}
