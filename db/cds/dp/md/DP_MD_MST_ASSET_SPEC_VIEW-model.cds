namespace dp;

@cds.persistence.exists
entity Md_Mst_Asset_Spec_View {
    key tenant_id                       : String(5)   not null  @title:'테넌트ID';
        company_code                    : String(10)  not null  @title:'회사코드';
        org_code                        : String(10)  not null  @title:'조직코드';
    key mold_id                         : String(100) not null  @title:'금형ID';
        asset_number                    : String(100)           @title:'자산번호';
        mold_number                     : String(40)  not null  @title:'부품번호';
        mold_sequence                   : String(100) not null  @title:'금형순번';
        model                           : String(100)           @title:'모델';
        class_desc                      : String(300)           @title:'품명';
        supplier_code                   : String(10)            @title:'공급업체코드';
        supplier_name                   : String(100)           @title:'공급업체명';
        production_supplier_code        : String(100)           @title:'제작협력사ID';
        production_supplier_name        : String(100)           @title:'제작협력사명';
        family_part_numbers             : String(1200)          @title:'가족부품번호';
        mold_item_type_code             : String(30)            @title:'금형품목유형코드';
        mold_item_type_name             : String(30)            @title:'금형품목유형명';
        currency_code                   : String(30)            @title:'통화코드';
        asset_type_code                 : String(30)            @title:'자산유형코드';
        asset_status_code               : String(30)            @title:'자산상태코드';
        acq_date                        : String(8)             @title:'취득일자';
        mold_tonnage                    : Decimal(20, 2)        @title:'금형톤수';
        use_material_value              : String(240)           @title:'사용재질값';
        cavity_process_qty              : String(100)           @title:'캐비티프로세스수량';
}