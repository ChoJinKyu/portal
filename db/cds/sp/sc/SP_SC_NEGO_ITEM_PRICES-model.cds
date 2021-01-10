namespace sp;

using util from '../../cm/util/util-model';
using {sp as negoHeaders} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';

// using {sp as negoItemPrices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';

entity Sc_Nego_Item_Prices {
    key tenant_id                    : String(5) not null  @title : '테넌트ID';
    key nego_header_id               : Integer64 not null  @title : '협상헤더ID';
    key nego_item_number             : String(10) not null @title : '협상품목번호';
        up_                          : Association to negoHeaders.Sc_Nego_Headers;
        operation_org_a_id           : String(30) not null @title : '운영조직AID';
        operation_unit_code          : String(30) not null @title : '운영단위코드';
        award_progress_status_code   : String(25)          @title : '낙찰진행상태코드';
        item_type_code               : String(30) not null @title : '품목유형코드';
        inventory_item_code          : String(30) not null @title : '재고품목코드';
        material_code                : String(40)          @title : '자재코드';
        material_desc                : String(240)         @title : '자재내역';
        material_spec                : String(1000)        @title : '자재규격';
        excl_flag                    : String(1)           @title : '제외여부';
        ship_to_location_id          : String(30)          @title : '납품처위치코드';
        vendor_pool_code             : String(100)         @title : '협력사풀코드';
        request_quantity             : Decimal(20, 3)      @title : '요청수량';
        uom_code                     : String(3)           @title : 'UOM코드';
        maturity_date                : Date                @title : '만기일자';
        currency_code                : String(15)          @title : '통화코드';
        bidding_start_net_price      : Decimal(28, 9)      @title : '입찰시작단가';
        bidding_start_net_price_flag : String(1)           @title : '입찰시작단가디스플레이여부';
        bidding_target_net_price     : Decimal(28, 9)      @title : '입찰목표단가';
        current_price                : Decimal(28, 9)      @title : '현재가격';
        note_content                 : String(4000)        @title : '노트내용';
        award_quantity               : Decimal(20, 3)      @title : '낙찰수량';
        pr_number                    : String(50)          @title : '구매요청번호';
        pr_item_number               : String(10)          @title : '구매요청품목번호';
        file_group_number            : String(100)         @title : '파일그룹번호';
        update_date                  : Date                @title : '수정일자';
        origin_source_name           : String(30)          @title : '원천소스명';
        reference_info               : String(256)         @title : '참조정보';
        skip_flag                    : String(1)           @title : '스킵여부';
        after_skip_line_number       : Integer             @title : 'AFTER스킵라인수';
        requestor_empno              : String(30)          @title : '요청자사번';
        basic_net_price_id           : String(30)          @title : '기초단가ID';
        price_list_name              : String(30)          @title : '가격목록명';
}

extend Sc_Nego_Item_Prices with util.Managed;
