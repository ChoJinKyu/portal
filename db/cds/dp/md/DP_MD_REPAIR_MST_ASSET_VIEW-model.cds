namespace dp;

@cds.persistence.exists
entity Md_Repair_Mst_Asset_View {
        chk                             : Boolean               @title:'Checkbox';
    key tenant_id                       : String(5)   not null  @title:'테넌트ID';
        company_code                    : String(10)  not null  @title:'회사코드';
        org_code                        : String(10)  not null  @title:'조직코드';
    key repair_request_number           : String(100) not null  @title:'수선요청번호';
        repair_type_code                : String(30)            @title:'수선유형코드';
        repair_type_name                : String(30)            @title:'수선유형명';
        mold_id                         : String(100) not null  @title:'금형ID';
        asset_number                    : String(100)           @title:'자산번호';
        mold_number                     : String(40)  not null  @title:'부품번호';
        mold_sequence                   : String(100) not null  @title:'금형순번';
        repair_request_date             : String(8)             @title:'수선요청일자';
        repair_progress_status_code     : String(30)            @title:'수선진행상태코드';
        repair_progress_status_name     : String(30)            @title:'수선진행상태명';	
        repair_desc                     : String(500)           @title:'수선설명';
        model                           : String(100)           @title:'모델';
        spec_name                       : String(300)           @title:'품명';
        supplier_code                   : String(10)            @title:'공급업체코드';
        supplier_name                   : String(100)           @title:'공급업체명';
        production_supplier_code        : String(100)           @title:'제작협력사ID';
        production_supplier_name        : String(100)           @title:'제작협력사명';
        remark                          : String(3000)          @title:'비고';
        repair_reason                   : String(300)           @title:'수선사유';
        create_user_id                  : String(255)           @title:'등록사용자ID';
        family_part_numbers             : String(1200)          @title:'가족부품번호';
        mold_item_type_code             : String(30)            @title:'금형품목유형코드';
        mold_item_type_name             : String(30)            @title:'금형품목유형명';
        repair_factor                   : String(30)            @title:'수선요인';
        eco_number                      : String(45)            @title:'ECO번호';
        currency_code                   : String(30)            @title:'통화코드';
        repair_quotation_amount         : Decimal               @title:'수선견적금액';
        repair_amount                   : Decimal               @title:'수선금액';
        investment_ecst_type_code       : String(30)            @title:'투자비용유형코드';
        account_code                    : String(10)            @title:'계정코드';
        repair_supplier_code            : String(10)            @title:'수선공급업체코드';
        repair_supplier_name            : String(100)           @title:'수선공급업체명';
        repair_complete_date            : String(8)             @title:'완료일자';
}