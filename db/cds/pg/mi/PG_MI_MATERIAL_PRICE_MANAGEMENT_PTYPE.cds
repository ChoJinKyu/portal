namespace pg;

using util from '../../cm/util/util-model';

entity MI_Mat_Prc_Management_Ptype {
    key cud_flag              : String(1)     @title : 'Flag Field';
    key tenant_id             : String(5)     @title : '회사코드';
    key company_code          : String(10)    @title : '법인코드';
    key org_type_code         : String(30)    @title : '조직유형코드';
    key org_code              : String(10)    @title : '조직코드';
    key mi_material_code      : String(40)    @title : '시황자재코드';
        mi_material_code_name : String(240)   @title : '시황자재코드명';
    key category_code         : String(40)    @title : '카테고리코드';
        category_name         : String(240)   @title : '카테고리코드명';
        use_flag              : Boolean       @title : '사용여부';
    key exchange              : String(10)    @title : '거래소';
    key currency_unit         : String(30)    @title : '통화단위';
    key quantity_unit         : String(10)    @title : '수량단위';
        exchange_unit         : String(40)    @title : '거래소단위';
    key termsdelv             : String(10)    @title : '인도조건';
        sourcing_group_code   : String(10)    @title : '소싱그룹코드';
        delivery_mm           : String(10)    @title : '인도월';
    key mi_date               : Date          @title : '시황일자';
        amount                : Decimal(17, 3)@title : '금액';
}

extend MI_Mat_Prc_Management_Ptype with util.Managed;
