namespace dp;

using {User} from '@sap/cds/common';

entity Mold_Item {
    affiliate_code               : String(4) not null  @title         : '관계사 지사코드';
    org_code                     : String(3) not null  @title         : '사업부코드';
    item_id                      : Integer64 not null  @title         : '도번 id';
    part_no                      : String(50) not null @title         : '품번(도번)명';
    item_seq                     : Integer not null    @title         : '차수 ( 1호 금형, 2호 금형.....)';
    description                  : String(200)         @title         : '품명';
    model                        : String(50)          @title         : '모델';
    assets_no                    : String(30)          @title         : '자산번호';
    old_assets_no                : String(45)          @title         : '이전자산번호';
    item_type                    : String(10)          @title         : '금형구분 : PD / MD / RUB /...(IMDM_CODE 테이블에서 관리함)';
    prod_type                    : String(30)          @title         : '제작 구분 ( N : 신작, R : 노후대체,K : 저장품) / [B:백업,F:FDM,M:MOCK-UP,N:신작,S:간이금형]';
    offline_bid_flag             : String(1)           @title         : '공개입찰여부';
    e_d_type                     : String(1)           @title         : '수출/내수 구분 ( E: 수출, D: 내수 )';
    first_prod_date              : String(8)           @title         : '초품일 ( 견적시 : D+몇일 )';
    complete_date                : String(8)           @title         : '제작 완료일 ( 견적시 : D + 몇일 )';
    budget_report_no             : String(20)          @title         : '집행품의번호';
    budget_report_date           : String(8)           @title         : '집행품의완료일';
    budget_amount                : Integer             @title         : 'GBMS 가용예산금액';
    currency                     : String(3)           @title         : '통화코드';
    target_amount                : Integer             @title         : '목표가(tobe - 집행가)';
    estimate_end_date            : String(10)          @title         : '견적요청 완료일(Due Date)';
    item_update_flag             : String(1)           @title         : 'item수정여부(개발의뢰접수여부)';
    import_flag                  : String(1)           @title         : 'Y:도입,N:내수';
    costtable_flag               : String(1)           @title         : 'CostTable사용여부';
    estimate_report_no           : String(20)          @title         : '견적 요청 품의 번호';
    estimate_report_date         : String(8)           @title         : '견적 품의완료일( = 업체에 견적요청일 )';
    v_select_cancel_report_no    : String(20)          @title         : '업체선정 취소 품의 번호';
    v_select_cancel_report_date  : String(8)           @title         : '업체선정취소 품의 최종승인일자';
    v_select_cancel_reason       : String(200)         @title         : '업체선정취소 사유';
    v_select_remarks             : String(1000)        @title         : '업체선정비고';
    vend_select_report_no        : String(20)          @title         : '견적 업체 선정표 품의 번호';
    vend_select_report_date      : String(8)           @title         : '발주품의 최종승인일';
    confirm_amount               : Integer             @title         : '견적완료금액';
    order_vendor_id              : Integer             @title         : '발주처(제작업체) ID';
    order_amount                 : Integer             @title         : '발주금액';
    order_nego_status            : String(1)           @title         : '발주금액 nego status(임시저장:C, LGE 금액제시:L, 업체 금액제시:V, 업체합의 :A, 발주:O)';
    order_report_no              : String(20)          @title         : '발주 품의 번호';
    order_report_date            : String(8)           @title         : '발주 품의완료일( = 업체에 제작요청일 )';
    order_no                     : String(15)          @title         : '발주서 no';
    order_concurrent_yn          : String(1)           @title         : '동시발주 유무(Y:동시발주, N(or Null):요청발주)';
    invest_cost_type             : String(1)           @title         : '투자/경비 구분 ( 투자:I, 경비:C )';
    project_code                 : String(13)          @title         : 'PROJECT CODE';
    invest_code                  : String(12)          @title         : '투자코드';
    invest_seq                   : String(3)           @title         : '투자 항번';
    exec_seq                     : String(3)           @title         : '집행 항번';
    order_seq                    : String(2)           @title         : '발주 항번';
    order_item_seq               : String(3)           @title         : 'ICMS의 item_seq (invest_code 선택시 ICMS의 item_seq 선택)';
    dev_cancel_report_no         : String(20)          @title         : '개발취소품의번호';
    dev_cancel_report_date       : String(8)           @title         : '개발취소품의 최종승인일자';
    receipt_report_no            : String(20)          @title         : '입고 품의 번호';
    receipt_date                 : String(8)           @title         : '입고 확인 일자';
    receipt_amount               : Integer             @title         : '입고확인금액';
    receipt_complete_date        : Date             @title         : '입고 결재 완료 일자';
    account_code                 : String(10)          @title         : '계정코드';
    activity_code                : String(15)          @title         : '계정별 Activity코드';
    account_dept                 : String(6)           @title         : '비용부서';
    acquisition_dept             : String(6)           @title         : '취득부서';
    clear_expect_date            : String(8)           @title         : '정리예정일(저장품)';
    prod_vendor_id               : Integer             @title         : '양산처';
    remarks                      : String(4000)        @title         : '비고';
    created_by                   : User not null       @cds.on.insert : $user  @title         : '작성자';
    create_date                  : DateTime not null   @cds.on.insert : $now  @title          : '작성일';
    last_updated_by              : User not null       @cds.on.insert : $user  @cds.on.update : $user  @title : '최종수정자';
    last_update_date             : DateTime not null   @cds.on.insert : $now  @cds.on.update  : $now  @title  : '최종수정일';
    assets_flag                  : String(20)          @title         : '자산구분:Y- 부외자산';
    make_group                   : String(30)          @title         : '제품군(제품군2)';
    conversion_flag              : String(1)           @title         : 'conversion구분:Y-CONVERSION DATE';
    item_description             : String(300)         @title         : '품목명';
    model_class                  : String(300)         @title         : '모델구분';
    make_product                 : String(30)          @title         : '제품구분(제품군1)';
    dev_cd                       : String(30)          @title         : 'IPDS부품개발의뢰서 번호';
    dev_req_empno                : String(10)          @title         : '개발 의뢰자 사번';
    product_mold_yn              : String(3)           @title         : '상품금형 여부(Yes/No)';
    junju_yn                     : String(1)           @title         : '전주금형 여부';
    expect_qty                   : String(20)          @title         : '예상물량';
    family_pn                    : String(100)         @title         : '패밀리 Part No';
    pdm_transid                  : Integer             @title         : 'PDM I/F TRANSID';
    eco_no                       : String(20)          @title         : 'ECO_NO';
    pdm_revision                 : String(6)           @title         : '의뢰서 REVISION';
    pdm_transyn                  : String(1)           @title         : 'PDM 전송여부(P:미접수,Y:전송/N)';
    pdm_partrevision             : String(6)           @title         : 'PDM PARTREVISION';
    magam_yn                     : String(1)           @title         : '마감 Y/N';
    magam_dept                   : String(6)           @title         : '마감부서';
    magam_account                : String(10)          @title         : '마감계정코드';
    set_id                       : String(20)          @title         : 'SET ID';
    ap_flag                      : String(1)           @title         : 'AP구분';
    imp_order_report_no          : String(20)          @title         : '도입발주품의';
    imp_order_report_date        : String(8)           @title         : '도입발주품의 최종승인일';
    po_status                    : String(1)           @title         : 'Y:도입PO생성,N:도입PO미생성';
    market_type                  : String(10)          @title         : '금형직과';
    product_group                : String(15)          @title         : 'PRODUCT GROUP';
    product_group_type           : String(20)          @title         : 'PRODUCT GROUP구분';
    completion_report_no         : String(20)          @title         : '도입완료품의번호';
    completion_report_date       : String(8)           @title         : '도입완료품의최종승인일';
    order_contract_seq           : Integer             @title         : '구매계약서번호';
    lease_contract_seq           : Integer             @title         : '임대계약서번호';
    gbms_status                  : String(1)           @title         : 'GBMS처리상태(초기:N,가집행:E,반려:R,실집행:A)';
    gbms_detail_id               : Integer             @title         : 'GBMS 예산가집행SEQ(I/F시 detail_id로 사용)';
    lab_budget_amount            : Integer             @title         : '가집행금액';
    book_currency                : String(3)           @title         : '장부통화';
    budget_exchange_rate_date    : String(8)           @title         : 'Local : 업체선정일자, Import : 실집행일자';
    budget_exchange_rate         : Integer             @title         : '발주통화에 대한 장부통화 환율';
    split_payment_flag           : String(1)           @title         : '분할 지급여부 ';
    advanced_payment_rate        : Integer             @title         : '선급금 비율(%) ';
    part_payment                 : Integer             @title         : '중도급 비율(%) ';
    residual_payment             : Integer             @title         : '잔금 ( 입고후 지급금액 비율 )';
    sales_flag                   : String(1)           @title         : '매출여부( C: OM전송건, T : 해외이관, Y : 매출처리 완료건 )';
    pr_no                        : String(20)          @title         : 'PUCHANSING REQUISITION NUMBER';
    boi_no                       : String(100)         @title         : '무관세 증빙 번호';
    import_sub_affiliate_code    : String(4)           @title         : '매입법인 코드(관계사 Import일 경우만 사용)';
    import_sub_org_code          : String(3)           @title         : '매입법인 사업부 코드(관계사 Import일 경우만 사용)';
    person_in_charge_rd          : String(100)         @title         : '연구원';
    person_in_charge_pu          : String(100)         @title         : '구매담당자';
    prodvend_change_report_no    : String(20)          @title         : '양산처 변경 품의 번호';
    prodvend_change_report_date  : String(8)           @title         : '양산처 변경 품의 최종 완료 일자';
    receipt_tr_date              : Date             @title         : '입고확정 최초 처리일자.,';
    inspection_date              : String(8)           @title         : '검사일자';
    pis_cofins_flag              : String(1)           @title         : 'PIS/COFINS 여부 (브라질월드컵 한시적용 - defult : Y (ESSP) )';
    temp_ap_flag                 : String(1)           @title         : '가 AP 생성 여부';
    spare_part_flag              : String(1)           @title         : 'RFID I/F SPARE PART FLAG (ONLY EKHQ)';
    outsourcing_merchandise_flag : String(1)           @title         : '';
    tax_exemption_flag           : String(1)           @title         : 'LOCAL 금형의 면세여부';
    spare_part_seq               : Integer             @title         : 'SPARE PART 차수 (0:금형, 1이상:SPARE PART)';
    family_part_no_1             : String(50)          @title         : '';
    family_part_no_2             : String(50)          @title         : '';
    family_part_no_3             : String(50)          @title         : '';
    family_part_no_4             : String(50)          @title         : '';
    family_part_no_5             : String(50)          @title         : '';
    original_fa_item_id          : Integer             @title         : 'SPARE PART에 대하여 자본적지출(CE) 할 ORGINAL 금형의 ITEM ID';
    test_use_yn                  : String(1) not null  @title         : 'T-EST 사용 여부 (Y/N)';
    mold_type                    : String(2)           @title         : '금형 TYPE (PUMDM_GLOBAL_CODE.CODE_CLASS = G001 ), ITEM_TYPE에 종속되는 CODE 임';
    mold_vendor_id               : Integer             @title         : '금형 제작처(Mold Supplier) ID (발주처:Order Vendor, 양산처:Prod Vendor) ';
    mold_developer               : String(50)          @title         : '';
    gpdm_project_code            : String(50)          @title         : '';
    gpdm_project_name            : String(100)         @title         : '';
    buyer_asset_type             : String(1)           @title         : '';

}
