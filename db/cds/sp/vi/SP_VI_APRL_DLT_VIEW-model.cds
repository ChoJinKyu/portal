namespace sp; 

@cds.persistence.exists
entity Vi_Aprl_Dtl_View {
     key tenant_id                       : String(5)   not null  @title:'테넌트ID';
    key approval_number                 : String(50)  not null  @title:'품의번호';
    key item_sequence                   : String(34)  not null  @title:'품목번호';
    key net_price_type_code             : String(50)  not null  @title:'기준단가구분코드';
        net_price_type_name             : String(240)  not null @title:'기준단가구분명';
        company_code                    : String(10)  not null  @title:'회사코드';
        company_name                    : String(240)           @title:'회사명';
        affiliate_code                  : String(10)  not null  @title:'법인코드';
        bizunit_code                    : String(10)  not null  @title:'본부코드';
        bizunit_name                    : String(240)           @title:'본부명';
        management_mprice_code          : String(30)  not null  @title:'관리시세구분코드';
        management_mprice_name          : String(240)           @title:'관리시세구분명';
        base_year                       : String(4 )  not null  @title:'기준년도';
        apply_start_yyyymm              : String(6)   not null  @title:'적용시작년월';
        apply_end_yyyymm                : String(6)   not null  @title:'적용종료년월';
        bizdivision_code                : String(10)  not null  @title:'사업부코드';
        bizdivision_name                : String(240)           @title:'사업부명';
        plant_code                      : String(10)  not null  @title:'플랜트코드';
        plant_name                      : String(240)           @title:'플랜트명';
        supply_plant_code               : String(10)            @title:'공급플랜트코드';
        supply_plant_name               : String(240)           @title:'공급플랜트명';
        supplier_code                   : String(10) not null   @title:'공업업체코드';
        supplier_local_name             : String(240)           @title:'공급업체명';
        material_code                   : String(40) not null   @title:'자재코드';
        material_name                   : String(240)           @title:'자재명';
        vendor_pool_code                : String(20)            @title:'협력사풀코드';
        vendor_pool_local_name          : String(240)           @title:'협력사풀명';
        currency_code                   : String(3)  not null   @title:'통화코드';
        base_uom_code                   : String(30)            @title:'단위';
        base_price                      : Decimal(19,4)         @title:'기준단가';
        buyer_empno                     : String(8)             @title:'구매담당자';
        buyer_empno_name                : String(240)           @title:'구매담당자명';
        pcst                            : Decimal(19,4)         @title:'가공비';
        metal_net_price                 : Decimal(19,4)         @title:'메탈가';
        ni_price                        : Decimal(19,4)         @title:'니켈단가';
        co1_price                       : Decimal(19,4)         @title:'Co1단가';
        co2_price                       : Decimal(19,4)         @title:'Co2단가';
        mn_price                        : Decimal(19,4)         @title:'Mn단가';
        li1_price                       : Decimal(19,4)         @title:'Li1단가';
        li2_price                       : Decimal(19,4)         @title:'Li2단가';
        li3_price                       : Decimal(19,4)         @title:'Li3단가';
        li4_price                       : Decimal(19,4)         @title:'Li4단가';
        w_price                         : Decimal(19,4)         @title:'W단가';
        cu_price                        : Decimal(19,4)         @title:'Cu단가';
        al_price                        : Decimal(19,4)         @title:'Al단가';
        coating_mat_net_price           : Decimal(19,4)         @title:'코팅재단가';
        fabric_net_price                : Decimal(19,4)         @title:'원단가';
        local_create_dtm                : DateTime              @title:'로컬타임등록시간'; 
        local_update_dtm                : DateTime              @title:'로컬타임수정시간'; 
        create_user_id                  : String(255)           @title:'시스템등록자ID'; 
        update_user_id                  : String(255)           @title:'시스템수정자ID';
        system_create_dtm               : DateTime              @title:'시스템등록시간';
        system_update_dtm               : DateTime              @title:'시스템수정시간';
}