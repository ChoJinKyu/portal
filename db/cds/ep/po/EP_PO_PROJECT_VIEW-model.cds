namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Po_Project_View {

    key tenant_id               : String(5) not null  @title : '테넌트ID';
    key company_code            : String(10) not null @title : '회사코드';
    key ep_project_number       : String(50) not null @title : '설비공사용프로젝트번호';
        project_name            : String(100)         @title : '프로젝트명';
        ep_purchasing_type_code : String(30)          @title : '설비공사용구매유형코드';
        ep_purchasing_type_name : String(240)         @title : '설비공사용구매유형';
        plant_code              : String(10)          @title : '플랜트코드';
        plant_name              : String(240)         @title : '플랜트명';
        bizunit_code            : String(10)          @title : '사업본부코드';
        bizunit_name            : String(240)         @title : '사업본부명';
        bizdivision_code        : String(10)          @title : '사업부코드';
        bizdivision_name        : String(240)         @title : '사업부명';
        remark                  : String(3000)        @title : '비고';
        org_type_code           : String(2)           @title : '조직유형코드';
        org_code                : String(10)          @title : '조직코드';
        create_user_name        : String(30)          @title : '작성자명';


}

extend Po_Project_View with util.Managed;
