namespace dp;

@cds.persistence.exists
entity Dp_Tc_Project_Addition_Info_Type {
    key tenant_id           : String(5) not null  @title : '테넌트ID';
    key project_code        : String(30) not null @title : '프로젝트코드';
    key model_code          : String(40) not null @title : '모델코드';
    key addition_type_code  : String(30) not null @title : '추가유형코드';
    key period_code         : String(30) not null @title : '기간코드';
        uom_code            : String(3)           @title : 'UOM코드';    
        addition_type_value : String(10)          @title : '추가유형값';
}