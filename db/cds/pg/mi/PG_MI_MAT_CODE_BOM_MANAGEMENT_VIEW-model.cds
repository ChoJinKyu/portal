namespace pg;

@cds.persistence.exists

entity MI_Mat_Code_BOM_Management_View {
    key tenant_id             : String(5)     @title : '회사코드';
        tenant_name           : String(240)   @title : '회사명';
    key company_code          : String(10)    @title : '법인코드';
    key org_type_code         : String(30)    @title : '조직유형코드';
    key org_code              : String(10)    @title : '조직코드';
    key material_code         : String(40)    @title : '자재코드';
        material_desc         : String(240)   @title : '자재명';
    key supplier_code         : String(10)    @title : '공급업체코드';
        supplier_local_name   : String(240)   @title : '공급업체로컬명';
        supplier_english_name : String(240)   @title : '공급업체영문명';
        base_quantity         : Decimal(17, 3)@title : '기준수량';
        processing_cost       : Decimal(17, 3)@title : '가공비';
        pcst_currency_unit    : String(30)    @title : '가공비통화단위';
        mi_bom_id             : String(100)   @title : '시황자재명세서ID';
        mi_material_code      : String(40)    @title : '시황자재코드';
        mi_material_name      : String(240)   @title : '시황자재명';
        category_code         : String(40)    @title : '카테고리코드';
        category_name         : String(240)   @title : '카테고리코드명';
        reqm_quantity_unit    : String(10)    @title : '소요수량단위';
        reqm_quantity         : Decimal(17, 3)@title : '소요수량';
        currency_unit         : String(30)    @title : '통화단위';
        mi_base_reqm_quantity : Decimal(17, 3)@title : '시황자재기준소요수량';
        quantity_unit         : String(10)    @title : '수량단위';
        exchange              : String(10)    @title : '거래소';
        termsdelv             : String(10)    @title : '인도조건';
        use_flag              : Boolean       @title : '사용여부';
        local_create_dtm      : DateTime      @title : '로컬생성시간';
        local_update_dtm      : DateTime      @title : '로컬수정시간';
        create_user_id        : String(255)   @title : '생성자';
        update_user_id        : String(255)   @title : '수정자';
        system_create_dtm     : DateTime      @title : '시스템생성시간';
        system_update_dtm     : DateTime      @title : '시스템수정시간';
}
