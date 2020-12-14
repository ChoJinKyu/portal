namespace pg;

@cds.persistence.exists

entity MI_Material_Cost_Info_View {
    key tenant_id        : String(5)     @title : '회사코드';
    key company_code     : String(10)    @title : '법인코드';
    key org_type_code    : String(30)    @title : '조직유형코드';
    key org_code         : String(10)    @title : '조직코드';
    key mi_material_code : String(40)    @title : '시황자재코드';
        mi_material_name : String(240)   @title : '시황자재명';
    key currency_unit    : String(30)    @title : '통화단위';
    key quantity_unit    : String(10)    @title : '수량단위';
    key exchange         : String(10)    @title : '거래소';
    key termsdelv        : String(10)    @title : '인도조건';
    key mi_date          : Date          @title : '시황일자';
        amount           : Decimal(17, 3)@title : '금액';
}
