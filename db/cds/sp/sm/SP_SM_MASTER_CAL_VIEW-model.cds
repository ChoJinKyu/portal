namespace sp;

@cds.persistence.exists

entity Sm_Master_Cal_View {
    key tenant_id          : String(5)  @title : '테넌트ID';
        chain_group_code   : String(5)  @title : '체인&상위그룹코드';
    key chain_code         : String(30) @title : '체인코드';
    key group_code         : String(30) @title : '그룹코드';
        group_name         : String(240)@title : '그룹명';
        group_descripition : String(500)@title : '그룹설명';
    key code               : String(30) @title : '코드';
        sort_no            : Decimal    @title : '정렬번호';
    key language_cd        : String(30) @title : '언어코드';
        code_name          : String(240)@title : '코드명';

}
