namespace dp;

using {User} from '@sap/cds/common';

@cds.persistence.exists
entity Md_Mst_Spec_View {

        company_name                    : String;
        org_name                        : String;
        create_user_name                : String;
        create_user                     : String;
        last_update_date                : String;
        mold_item_type_name             : String;
        mold_production_type_name       : String;
        mold_spec_status_name           : String;
        mold_progress_status_name       : String;
        family_part_numbers             : String;
        receipt_confirmed_user_name     : String;
        inspection_date_plan            : String;
        production_complete_date_plan   : String;
        mold_mfger_name                 : String;
        supplier_name                   : String;
        production_supplier_name        : String;
    key tenant_id                       : String(5) not null   @title : '테넌트ID';
        company_code                    : String(10) not null  @title : '회사코드';
        org_type_code                   : String(10) not null  @title : '조직유형코드';
        org_code                        : String(10) not null  @title : '조직코드';
        mold_number                     : String(40) not null  @title : '부품번호';
        mold_sequence                   : String(100) not null @title : '금형순번';
    key mold_id                         : String(100) not null @title : '금형ID';
        mold_progress_status_code       : String(30)           @title : '금형진행상태코드';
        spec_name                       : String(500)          @title : '규격명';
        model                           : String(100)          @title : '모델';
        asset_number                    : String(100)          @title : '자산번호';
        mold_item_type_code             : String(30)           @title : '금형품목유형코드';
        mold_production_type_code       : String(30)           @title : '금형제작유형코드';
        mold_location_type_code         : String(30)           @title : '금형위치유형코드';
        first_production_date           : String(8)            @title : '첫번째제작일자';
        production_complete_date        : String(8)            @title : '제작완료일자';
        budget_amount                   : Decimal(20, 2)       @title : '예산금액';
        currency_code                   : String(30)           @title : '통화코드';
        target_amount                   : Decimal(20, 2)       @title : '목표금액';
        mold_purchasing_type_code       : String(30)           @title : '금형구매유형코드';
        supplier_selection_remark       : String(3000)         @title : '공급업체선정비고';
        order_confirmed_amount          : Decimal(20, 2)       @title : '발주확정금액';
        supplier_code                   : String(10)           @title : '공급업체코드';
        purchasing_amount               : Decimal(20, 2)       @title : '구매금액';
        order_number                    : String(240)          @title : '발주번호';
        investment_ecst_type_code       : String(30)           @title : '투자경비유형코드';
        project_code                    : String(30)           @title : '프로젝트코드';
        receiving_amount                : Decimal(20, 2)       @title : '입고금액';
        receiving_complete_date         : String(8)            @title : '입고완료일자';
        account_code                    : String(30)           @title : '계정코드';
        accounting_department_code      : String(30)           @title : '회계부서코드';
        acq_department_code             : String(30)           @title : '취득부서코드';
        production_supplier_code        : String(100)          @title : '제작협력사ID';
        remark_mst                      : String(3000)         @title : '비고';
        mold_develope_request_type_code : String(30)           @title : '금형개발요청유형코드';
        mold_develope_requestor_empno   : String(255)          @title : '금형개발요청자사번';
        eco_number                      : String(240)          @title : 'ECO번호';
        set_id                          : String(100)          @title : 'SETID';
        ap_transfer_status_code         : String(30)           @title : 'AP전송유형코드';
        market_type_code                : String(30)           @title : '시장유형코드';
        product_group_code              : String(30)           @title : '제품그룹코드';
        product_group_type_code         : String(30)           @title : '제품그룹유형코드';
        purchasing_contract_number      : String(50)           @title : '구매계약번호';
        lease_contract_number           : String(50)           @title : '임대계약번호';
        provisional_budget_amount       : Decimal(20, 2)       @title : '가집행예산금액';
        book_currency_code              : String(30)           @title : '장부통화코드';
        budget_exrate_date              : String(8)            @title : '예산환율일자';
        budget_exrate                   : Decimal(20, 2)       @title : '예산환율';
        split_pay_type_code             : String(30)           @title : '분할지급코드';
        prepay_rate                     : Decimal(20, 2)       @title : '선급금비율';
        progresspay_rate                : Decimal(20, 2)       @title : '중도금비율';
        rpay_rate                       : Decimal(20, 2)       @title : '잔여금액비율';
        mold_sales_status_code          : String(30)           @title : '금형매출상태코드';
        pr_number                       : String(240)          @title : '구매요청번호';
        import_company_code             : String(30)           @title : '수입회사코드';
        import_company_org_code         : String(30)           @title : '수입회사조직코드';
        inspection_date                 : String(8)            @title : '검사일자';
        family_part_number_1            : String(240)          @title : '가족부품번호1';
        family_part_number_2            : String(240)          @title : '가족부품번호2';
        family_part_number_3            : String(240)          @title : '가족부품번호3';
        family_part_number_4            : String(240)          @title : '가족부품번호4';
        family_part_number_5            : String(240)          @title : '가족부품번호5';
        mold_cost_analysis_type_code    : String(30)           @title : '금형원가분석유형코드';
        mold_type_code                  : String(30)           @title : '금형유형코드';
        mold_mfger_code                 : String(10)           @title : '금형공급업체코드';
        mold_developer_empno            : String(255)          @title : '금형개발자사번';
        customer_asset_type_code        : String(30)           @title : '고객자산유형코드';
        asset_type_code                 : String(30)           @title : '자산유형코드';
        asset_status_code               : String(30)           @title : '자산상태코드';
        scrap_date                      : String(8)            @title : '폐기일자';
        acq_date                        : String(8)            @title : '취득일자';
        acq_amount                      : Decimal(20, 2)       @title : '취득금액';
        use_department_code             : String(30)           @title : '사용부서코드';
        receipt_confirmed_date          : String(8)            @title : '입고확정일자';
        receipt_confirmed_user_empno    : String(30)           @title : '입고확정사용자사번';
        use_material_value              : String(240)          @title : '사용재질값';
        inspection_flag                 : Boolean              @title : '검사여부';
        assembly_approval_flag          : Boolean              @title : '조립승인여부';
        request_life_shot_count         : Integer              @title : '요구수명샷개수';
        order_qty                       : Decimal(20, 2)       @title : '주문수량';
        cavity_process_qty              : String(100)          @title : '캐비티프로세스수량';
        mold_tonnage                    : Decimal(20, 2)       @title : '금형톤수';
        die_form                        : String(240)          @title : '다이형상';
        mold_outform_spec_name          : String(240)          @title : '사출OUTFORM규격명';
        mold_runnerout_spec_name        : String(240)          @title : '사출RUNNEROUT규격명';
        mold_undercut_spec_name         : String(240)          @title : '사출UNDERCUT규격명';
        mold_hot_runner_spec_name       : String(240)          @title : '사출핫러너규격명';
        mold_gate_spec_name             : String(240)          @title : '사출GATE규격명';
        mold_return_type_name           : String(240)          @title : '사출RETURN유형명';
        mold_formout_method             : String(240)          @title : '사출제품취출방법';
        mold_sample_qty                 : Integer              @title : '사출샘플수량';
        mold_hot_runner_qty             : Integer              @title : '사출핫러너수량';
        mold_cavity_material_name       : String(240)          @title : '사출캐비티재질명';
        mold_core_material_name         : String(240)          @title : '사출코어재질명';
        mold_slide_core_material_name   : String(240)          @title : '사출슬라이드코어재질명';
        mold_slope_material_name        : String(240)          @title : '사출슬롭재질명';
        press_die_material_name         : String(240)          @title : '프레스다이재질명';
        press_punch_material_name       : String(240)          @title : '프레스펀치재질명';
        remark                          : String(3000)         @title : '비고';
        top_circle_material_name        : String(240)          @title : '상원판재질명';
        bottom_circle_material_name     : String(240)          @title : '하원판재질명';
        top_core_material_name          : String(240)          @title : '상코어재질명';
        bottom_core_material_name       : String(240)          @title : '하코어재질명';
        middle_core_material_name       : String(240)          @title : '중코어재질명';
        core_material_name              : String(240)          @title : '코어재질명';
        slide_core_material_name        : String(240)          @title : '슬라이드코어재질명';
        cycle_time                      : Decimal(20, 2)       @title : '주기시간';
        inject_machine_name             : String(240)          @title : '사출기명';
        top_holder_material_name        : String(240)          @title : '상홀더재질명';
        bottom_holder_material_name     : String(240)          @title : '하홀더재질명';
        die_material_name               : String(240)          @title : '다이재질명';
        stripper_material_name          : String(240)          @title : '스트리퍼재질명';
        punch_holder_material_name      : String(240)          @title : '펀치홀더재질명';
        punch_material_name             : String(240)          @title : '펀치재질명';
        pad_valve_material_name         : String(240)          @title : '패드밸브재질명';
        pad_material_name               : String(240)          @title : '패드재질명';
        spare_part_eyebolt_count        : Integer              @title : '스페어파트아이볼트개수';
        spare_part_ejslave_count        : Integer              @title : '스페어파트이젝터슬레이브개수';
        spare_part_ejector_pin_count    : Integer              @title : '스페어파트이젝터핀개수';
        spare_part_heater_count         : Integer              @title : '스페어파트히터개수';
        spare_part_speaker_core_count   : Integer              @title : '스페어파트스피커코어개수';
        spare_part_etc_count            : Integer              @title : '스페어파트기타개수';
        spare_part_p_punch_count        : Integer              @title : '스페어파트P펀치개수';
        spare_part_b_punch_count        : Integer              @title : '스페어파트B펀치개수';
        spare_part_spring_count         : Integer              @title : '스페어파트스프링개수';
        spare_part_die_button_count     : Integer              @title : '스페어파트다이버튼개수';
        spare_part_steam_cap_count      : Integer              @title : '스페어파트스팀 캡개수';
        spare_part_feeder_count         : Integer              @title : '스페어파트피더개수';
        spare_part_ejector_count        : Integer              @title : '스페어파트이젝터개수';
        mold_size                       : String(100)          @title : '금형크기';
        mold_weight                     : Decimal(20, 2)       @title : '금형중량';
        hot_runner_maker_name           : String(240)          @title : '핫러너제조사명';
        mold_size_2                     : String(100)          @title : '금형크기2';
        press_open_size                 : String(100)          @title : '프레스오픈크기';
        press_material_thickness        : String(100)          @title : '프레스재질두께';
        press_material_size             : String(100)          @title : '프레스재질크기';
        mold_spec_status_code           : String(30)           @title : '금형규격상태코드';
        mold_spec_register_date         : String;
        local_create_dtm                : DateTime             @title : '로컬등록시간';
        local_update_dtm                : DateTime             @title : '로컬수정시간';
        create_user_id                  : User                 @title : '등록사용자ID';
        update_user_id                  : User                 @title : '변경사용자ID';
        system_create_dtm               : DateTime             @title : '시스템등록시간';
        system_update_dtm               : DateTime             @title : '시스템수정시간';
}
