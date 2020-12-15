namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Li_Request_List_View {

    key tenant_id                  : String(5) not null     @title : '테넌트ID';
    key company_code               : String(10) not null    @title : '회사코드';
    key loi_write_number           : String(50) not null    @title : 'LOI작성번호';
        loi_number                 : String(50)             @title : 'LOI번호';
        request_date               : Date                   @title : '요청일자';
        loi_request_title          : String(100)            @title : 'LOI요청제목';
        loi_publish_purpose_desc   : String(1000)           @title : 'LOI발행목적설명';
        loi_request_status_code    : String(30)             @title : 'LOI요청상태코드';
        investment_review_flag     : Boolean                @title : '투자심의여부';
        buyer_empno                : String(30)             @title : '구매자사번';
        publish_date               : Date                   @title : '발행일자';
        supplier_code              : String(15)             @title : '공급업체코드';

}

extend Li_Request_List_View with util.Managed;
