namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Li_Request_Detail_View {

    key tenant_id                  : String(5) not null  @title : '테넌트ID';
    key company_code               : String(10) not null @title : '회사코드';
    key loi_write_number           : String(50) not null @title : 'LOI작성번호';
        loi_item_number            : String(50) not null @title : 'LOI품목번호';
        loi_number                 : String(50) not null @title : 'LOI번호';
        item_sequence              : Decimal not null    @title : '품목순번';
        plant_code                 : String(10)          @title : '플랜트코드';
        plant_name                 : String(10)          @title : '플랜트';
        ep_item_code               : String(50)          @title : '설비공사용품목코드';
        item_desc                  : String(200)         @title : '품명';
        unit                       : String(3)           @title : '단위';
        request_net_price          : Decimal             @title : '요청단가';
        request_quantity           : Decimal             @title : '요청수량';
        currency_code              : String(15)          @title : '통화코드';
        currency_name              : String(15)          @title : '통화';
        spec_desc                  : String(1000)        @title : '규격설명';
        delivery_request_date      : Date                @title : '납품요청일자';
        request_amount             : Decimal             @title : '요청금액';
        supplier_code              : String(100)         @title : '공급업체코드';
        supplier_name              : String(100)         @title : '공급업체';
        buyer_empno                : String(30)          @title : '구매자사번';
        buyer_name                 : String(30)          @title : '구매자이름';
        purchasing_department_code : String(50)          @title : '구매부서코드';
        remark                     : String(3000)        @title : '비고';
}

extend Li_Request_Detail_View with util.Managed;