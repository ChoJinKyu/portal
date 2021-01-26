namespace dp;

using util from '../../cm/util/util-model';

entity Md_Mst {
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
        remark                          : String(3000)         @title : '비고';
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


}

extend Md_Mst with util.Managed;
