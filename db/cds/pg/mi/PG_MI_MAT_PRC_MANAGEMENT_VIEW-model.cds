namespace pg;

@cds.persistence.exists

entity MI_Mat_Prc_Management_View {
    key mi_material_code    : String(40)    @title : '시황자재코드';
        mi_material_name    : String(240)   @title : '시황자재명';
        category_code       : String(40)    @title : '카테고리코드';
        category_name       : String(240)   @title : '카테고리코드명';
    key currency_unit       : String(30)    @title : '통화단위';
    key quantity_unit       : String(10)    @title : '수량단위';
        exchange_unit       : String(40)    @title : '거래소단위';
    key exchange            : String(10)    @title : '거래소';
    key termsdelv           : String(10)    @title : '인도조건';
        sourcing_group_code : String(10)    @title : '소싱그룹코드';
        delivery_mm         : String(10)    @title : '인도월';
    key mi_date             : Date          @title : '시황일자';
        price               : Decimal(28, 5)@title : '가격';
}
