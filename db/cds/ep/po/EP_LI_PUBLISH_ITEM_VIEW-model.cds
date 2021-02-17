namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Li_Publish_Item_View {

    key tenant_id                  : String(5) not null  @title : '테넌트ID';
    key company_code               : String(10) not null @title : '회사코드';
    key loi_write_number           : String(50) not null @title : 'LOI작성번호';
    key loi_item_number            : String(50) not null @title : 'LOI품목번호';
        loi_number                 : String(50) not null @title : 'LOI번호';
        item_sequence              : Decimal not null    @title : '품목순번';
        requestor_empno            : String(30)          @title : '요청자사번';
        requestor_name             : String(50)          @title : '요청자명';
        request_department_code    : String(50)          @title : '요청부서코드';
        request_department_name    : String(50)          @title : '요청부서명';
        buyer_empno                : String(30)          @title : '구매자사번';
        buyer_name                 : String(50)          @title : '구매자명';
        purchasing_department_code : String(50)          @title : '구매부서코드';
        purchasing_department_name : String(50)          @title : '구매부서명';
        loi_request_title          : String(100)         @title : 'LOI요청제목';
        item_desc                  : String(200)         @title : '품명';
        quotation_number           : Decimal             @title : '견적번호';
        quotation_item_number      : Decimal             @title : '견적품목번호';
        supplier_name              : String(50)          @title : '협력사명';
        publish_date               : Date                @title : '발행일자';
        delivery_request_date      : Date                @title : '납기일자';
        request_quantity           : Decimal             @title : '요청수량';
        unit                       : String(3)           @title : '단위';
        request_amount             : Decimal             @title : '요청금액';
        currency_code              : String(15)          @title : '통화코드';
        loi_selection_number       : String(50)          @title : 'LOI선정번호';
        loi_selection_status_code  : String(30)          @title : 'LOI선정상태코드';
        loi_selection_status_name  : String(240)         @title : 'LOI선정상태명';
        loi_selection_status_color : String(30)          @title : 'LOI선정상태컬러';
        loi_publish_number         : String(50)          @title : 'LOI발행번호';
        loi_publish_status_code    : String(30)          @title : 'LOI발행상태코드';
        loi_publish_status_name    : String(240)         @title : 'LOI발행상태명';
        loi_publish_status_color   : String(30)          @title : 'LOI발행상태컬러';
        // po_number                  : String(50)          @title : '발주번호';
        // po_item_number             : String(10)          @title : '발주품목번호';
        po_status_code             : String(30)          @title : '발주상태코드';
        request_date               : Date                @title : '요청일자';
        supplier_selection_date    : Date                @title : '업체선정일자';
        supplier_opinion           : String(3000)        @title : 'VOC';
        remark                     : String(3000)        @title : '비고';
        plant_code                 : String(10)          @title : '플랜트코드';
        plant_name                 : String(240)         @title : '플랜트명';
        spec_desc                  : String(1000)        @title : '규격설명';
        same_quotation_number      : String(1000)        @title : '동일한 업체선정품의 견적번호';
        same_quotation_item_number : String(1000)        @title : '동일한 업체선정품의 견적품목번호';
        same_selection_item_number : String(1000)        @title : '동일한 업체선정품의 항목';
        same_publish_item_number   : String(1000)        @title : '동일한 발행품의 항목';

}

extend Li_Publish_Item_View with util.Managed;
