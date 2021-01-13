namespace sp;

using util from '../../cm/util/util-model';
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model.cds';
using {sp as negoItemPrices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using {dp as materialMst} from '../../dp/mm/DP_MM_MATERIAL_MST-model';

// using {sp as negoHeaders} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';


entity Sc_Nego_Headers {
    key tenant_id                       : String(5) not null @title : '테넌트ID';
        // key tenant_id                       : Association to orgTenant.Org_Tenant @title : '테넌트ID';
    key nego_header_id                  : Integer64 not null @title : '협상헤더ID';
        Items                           : Composition of many negoItemPrices.Sc_Nego_Item_Prices
                                              on  Items.tenant_id      = $self.tenant_id
                                              and Items.nego_header_id = $self.nego_header_id;
        reference_nego_header_id        : Integer64          @title : '참조협상헤더ID';
        previous_nego_header_id         : Integer64          @title : '이존협상헤더ID';
        operation_unit_code             : String(30)         @title : '운영단위코드';
        reference_nego_document_number  : Integer            @title : '참조협상문서번호';
        nego_document_round             : Integer            @title : '협상문서회차';
        nego_document_number            : String(50)         @title : '협상문서번호';
        nego_document_title             : String(300)        @title : '협상문서제목';
        nego_document_desc              : String(4000)       @title : '협상문서설명';
        nego_progress_status_code       : String(30)         @title : '협상진행상태코드';
        award_progress_status_code      : String(25)         @title : '낙찰진행상태코드';
        //    award_date : Date   @title: '낙찰일자' ;
        reply_times                     : Integer            @title : '회신횟수';
        supplier_count                  : Integer            @title : '공급업체개수';
        nego_type_code                  : String(25)         @title : '협상유형코드';
        //    purchasing_order_type_code : String(30)   @title: '구매주문유형코드' ;
        negotiation_output_class_code   : String(100)        @title : '협상산출물분류코드';
        buyer_empno                     : String(30)         @title : '구매담당자사번';
        buyer_department_code           : String(10)         @title : '구매담당자부서코드';
        //    ship_to_location_code : Integer   @title: '납품처위치코드' ;
        //    submit_date : Date   @title: '제출일자' ;
        immediate_apply_flag            : String(1)          @title : '즉시적용여부';
        open_date                       : DateTime               @title : '오픈일자';
        closing_date                    : DateTime               @title : '마감일자';
        //    reference_closing_date : Date   @title: '참조마감일자' ;
        //    cancel_date : Date   @title: '취소일자' ;
        auto_rfq                        : String(1)          @title : 'Auto RFQ';
        itesm_count                     : Integer            @title : '품목수';
        negotiation_style_code          : String(30)         @title : '협상스타일코드';
        //    by_step_bidding_flag : String(1)   @title: '단계별입찰여부' ;
        //    round_bidding_flag : String(1)   @title: '회차입찰여부' ;
        //    nego_round_largest_times : Integer   @title: '협상회차최대횟수' ;
        //    next_round_auto_creation_flag : String(1)   @title: '다음회차자동생성여부' ;
        //    bidding_progress_hour_count : Integer   @title: '입찰진행시개수' ;
        //    price_condition_code : String(15)   @title: '가격조건코드' ;
        //    bidding_auto_closing_hour_cnt : Integer   @title: '입찰자동마감시간수' ;
        //    last_bid_af_auto_close_hours : Integer   @title: '최종입찰후자동마감시개수' ;
        close_date_ext_enabled_hours    : Integer            @title : '마감일자동연장가능시간수';
        close_date_ext_enabled_count    : Integer            @title : '마감일자동연장가능횟수';
        actual_extension_count          : Integer            @title : '실제연장횟수';
        remaining_hours                 : Decimal(28, 9)     @title : '잔여시간';
        note_content                    : LargeBinary        @title : '노트내용';
        award_type_code                 : String(100)        @title : '낙찰유형코드';
        target_amount_config_flag       : String(1)          @title : '목표금액설정여부';
        target_amount                   : Decimal(28, 2)     @title : '목표금액';
        //    award_supplier_option_mtd_cd : String(100)   @title: '낙찰공급업체선택방법코드' ;
        //    award_supplier_count : Integer   @title: '낙찰공급업체건수' ;
        //    purchasing_ord_portion_rate_val : String(100)   @title: '구매주문분배비율문자값' ;
        supplier_participation_flag     : String(1)          @title : '공급업체참여여부';
        partial_allow_flag              : String(1)          @title : '부분허용여부';
        //    orientation_execution_flag : String(1)   @title: '오리엔테이션실행여부' ;
        //    ot_contact_employee_no : String(30)   @title: '오리엔테이션담당자사원번호' ;
        //    orientation_contact_phone_no : String(30)   @title: '오리엔테이션담당자전화번호' ;
        //    orientation_start_date : Date   @title: '오리엔테이션시작일자' ;
        //    orientation_location_desc : String(1000)   @title: '오리엔테이션위치설명' ;
        //    interface_source_code : String(30)   @title: '인터페이스소스코드' ;
        //    reference_info : String(256)   @title: '참조정보' ;
        bidding_result_open_status_code : String(30)         @title : '입찰결과오픈상태코드';
//    bidding_info_buyer_open_date : Date   @title: '입찰정보바이어오픈일자' ;
//    bidding_info_supplier_open_date : Date   @title: '입찰정보공급업체오픈일자' ;
//    bidding_info_pur_contact_empno : String(30)   @title: '입찰정보구매연락사번' ;
//    bidding_info_supp_contact_empno : String(30)   @title: '입찰정보공급연락사번' ;
//    evaluation_closing_date : Date   @title: '평가마감일자' ;
//    conversion_type_code : String(30)   @title: '변환유형코드' ;
//    file_group_code : String(100)   @title: '파일그룹코드' ;
//    change_reason_desc : String(1000)   @title: '변경사유설명' ;
//    prcd_validation_target_flag : String(1)   @title: '선행검증대상여부' ;
//    approval_flag : String(1)   @title: '품의여부' ;
//    suffix_flag : String(1)   @title: 'SUFFIX여부' ;
//    usage_code : String(40)   @title: '용도코드' ;

// include structure util.Managed
// local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;

}

extend Sc_Nego_Headers with util.Managed;
