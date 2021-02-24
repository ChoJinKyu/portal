namespace pg;

@cds.persistence.exists

entity MI_Mat_Code_BOM_Management_Header_View {
    key tenant_id             : String(5)     @title : '터넨트ID';
        tenant_name           : String(240)   @title : '테넌트명';
    key material_code         : String(40)    @title : '자재코드';
        material_desc         : String(240)   @title : '자재명';
    key supplier_code         : String(10)    @title : '공급업체코드';
        supplier_local_name   : String(240)   @title : '공급업체로컬명';
        supplier_english_name : String(240)   @title : '공급업체영문명';
        base_quantity         : Decimal(17, 3)@title : '기준수량';
        base_quantity_unit    : String(3)     @title : '기준수량단위';
        processing_cost       : Decimal(17, 3)@title : '가공비';
        pcst_currency_unit    : String(30)    @title : '가공비통화단위';
    key mi_bom_id             : String(100)   @title : '시황자재명세서ID';
        local_create_dtm      : DateTime      @title : '로컬등록시간';
        local_update_dtm      : DateTime      @title : '로컬수정시간';
        create_user_id        : String(255)   @title : '등록사용자ID';
        update_user_id        : String(255)   @title : '변경사용자ID';
        system_create_dtm     : DateTime      @title : '시스템등록시간';
        system_update_dtm     : DateTime      @title : '시스템수정시간';
}
