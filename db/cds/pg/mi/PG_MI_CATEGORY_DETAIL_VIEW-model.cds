namespace pg;

@cds.persistence.exists

entity MI_Cateogry_Detail_View {
    key tenant_id          : String(40)    @title : '회사코드';
    key mi_material_code   : String(40)    @title : '시황자재코드';
        mi_material_name   : String(240)   @title : '시황자재명';
        category_code      : String(40)    @title : '카테고리코드';
        category_name      : String(240)   @title : '카테고리명';
        reqm_quantity_unit : String(10)    @title : '소요수량단위';
        reqm_quantity      : Decimal(17, 3)@title : '소요수량';
        use_flag           : Boolean       @title : '사용여부';
    key currency_unit      : String(30)    @title : '통화단위';
    key quantity_unit      : String(10)    @title : '수량단위';
    key exchange           : String(10)    @title : '거래소';
    key termsdelv          : String(10)    @title : '인도조건';
    key mi_date            : Date          @title : '시황일자';
        amount             : Decimal(17, 3)@title : '금액';
}
