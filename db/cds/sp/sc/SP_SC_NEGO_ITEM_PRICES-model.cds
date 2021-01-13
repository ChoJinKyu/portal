namespace sp;

using util from '../../cm/util/util-model';
using {sp as negoHeaders} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp as negoSuppliers} from '../../sp/sc/SP_SC_NEGO_SUPPLIERS-model';

// using {sp as negoItemPrices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';

entity Sc_Nego_Item_Prices {
    key tenant_id                    : String(5) not null  @title : '테넌트ID';
    key nego_header_id               : Integer64 not null  @title : '협상헤더ID';
    key nego_item_number             : String(10) not null @title : '협상품목번호';
        Suppliers                    : Composition of many negoSuppliers.Sc_Nego_Suppliers
                                           on  Suppliers.tenant_id        = $self.tenant_id
                                           and Suppliers.nego_header_id   = $self.nego_header_id
                                           and Suppliers.nego_item_number = $self.nego_item_number;
        Header                       : Association to negoHeaders.Sc_Nego_Headers
                                           on  Header.tenant_id      = $self.tenant_id
                                           and Header.nego_header_id = $self.nego_header_id;
        operation_org_code           : String(30)          @title : '운영조직코드';
        operation_unit_code          : String(30)          @title : '운영단위코드';
        award_progress_status_code   : String(25)          @title : '낙찰진행상태코드';
        //    item_type_code : String(30)   @title: '품목유형코드' ;
        line_type_code               : String(30)          @title : '라인유형코드';
        //    inventory_item_code : String(30)   @title: '재고품목코드' ;
        material_code                : String(40)          @title : '자재코드';
        material_desc                : String(240)         @title : '자재내역';
        //    material_spec : String(1000)   @title: '자재규격' ;
        specification                : String(30)          @title : '사양';
        bpa_price                    : Decimal(28, 9)      @title : 'BPA Price';
        detail_net_price             : Decimal(28, 9)      @title : '상세단가';
        recommend_info               : String(30)          @title : '추천정보';
        group_id                     : String(30)          @title : 'Group Id';
        sparts_supply_type           : String(30)          @title : 'S/Parts Supply Type';
        location                     : String(30)          @title : 'Location';
        purpose                      : String(30)          @title : '목적';
        reason                       : String(30)          @title : '사유';
        request_date                 : String(30)          @title : '요청일';
        attch_code                   : String(30)          @title : '첨부파일코드';
        supplier_provide_info        : String(30)          @title : '공급업체제공정보';
        incoterms                    : String(30)          @title : 'Incoterms';
        excl_flag                    : String(1)           @title : '제외여부';
        //    ship_to_location_id : String(30)   @title: '납품처위치코드' ;
        specific_supplier_count      : Integer             @title : 'Specific Supplier 개수';
        vendor_pool_code             : String(100)         @title : '협력사풀코드';
        request_quantity             : Decimal(28, 3)      @title : '요청수량';
        uom_code                     : String(3)           @title : 'UOM코드';
        maturity_date                : Date                @title : '만기일자';
        currency_code                : String(5)           @title : '통화코드';
        response_currency_code       : String(15)          @title : '응답통화코드';
        exrate_type_code             : String(15)          @title : '환율유형코드';
        exrate_date                  : String(15)          @title : '환율일자';
        //    exrate : String(15)   @title: '환율' ;
        bidding_start_net_price      : Decimal(28, 9)      @title : '입찰시작단가';
        bidding_start_net_price_flag : String(1)           @title : '입찰시작단가디스플레이여부';
        bidding_target_net_price     : Decimal(28, 9)      @title : '입찰목표단가';
        current_price                : Decimal(28, 9)      @title : '현재가격';
        note_content                 : LargeBinary         @title : '노트내용';
        //    award_quantity : Decimal(28,3)   @title: '낙찰수량' ;
        pr_number                    : String(50)          @title : '구매요청번호';
        //    pr_item_number : String(10)   @title: '구매요청품목번호' ;
        pr_approve_number            : String(50)          @title : '구매요청승인번호';
        req_submission_status        : String(10)          @title : 'Req Submission Status';
        req_reapproval               : String(10)          @title : 'Req Reapproval';
        requisition_flag             : String(1)           @title : 'Requisition Flag';
        price_submission_no          : String(30)          @title : 'Price Submission No';
        price_submisstion_status     : String(10)          @title : 'Price Submisstion Status';
        interface_source             : String(30)          @title : 'Interface Source';
        //    file_group_number : String(100)   @title: '파일그룹번호' ;
        //    update_date : Date   @title: '수정일자' ;
        //    origin_source_name : String(30)   @title: '원천소스명' ;
        //    reference_info : String(256)   @title: '참조정보' ;
        //    skip_flag : String(1)   @title: '스킵여부' ;
        //    after_skip_line_number : Integer   @title: 'AFTER스킵라인수' ;
        requestor_empno              : String(30)          @title : '요청자사번';
        budget_department_code       : String(30)          @title : '예산부서코드';
        request_department_code      : String(30)          @title : '요청부서코드';
//    basic_net_price_id : String(30)   @title: '기초단가ID' ;
//    price_list_name : String(30)   @title: '가격목록명' ;

// include structure util.Managed
// local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;
}

extend Sc_Nego_Item_Prices with util.Managed;
