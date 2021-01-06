namespace sp;

using util from '../../cm/util/util-model';

entity VI_Receipt_Txn_Hist {
    key tenant_id                 : String(5) not null  @title : '테넌트ID';
    key transaction_id            : Integer64 not null  @title : '트랜잭션아이디';
    key receipt_type_code         : String(30) not null @title : '입고유형코드';
    key plant_code                : String(10) not null @title : '플랜트코드';
    key receipt_yyyymm            : String(6) not null  @title : '입고년월';
        company_code              : String(10) not null @title : '회사코드';
        au_code                   : String(10) not null @title : '회계단위코드';
        material_code             : String(40) not null @title : '자재코드';
        supplier_code             : String(10) not null @title : '공급업체코드';
        line_type_code            : String(30)          @title : '라인유형코드';
        po_type_code              : String(30)          @title : '구매오더유형코드';
        buyer_empno               : String(30)          @title : '구매담당자사번';
        market_code               : String(30)          @title : '납선코드';
        maker_code                : String(30)          @title : '제조사코드';
        agent_code                : String(30)          @title : '대행사코드';
        receipt_date              : Date not null       @title : '입고일자';
        net_price                 : Decimal not null    @title : '단가';
        currency_code             : String(3) not null  @title : '통화코드';
        local_currency_code       : String(3) not null  @title : '로컬통화코드';
        receipt_quantity          : Decimal not null    @title : '입고수량';
        exrate_date               : Date                @title : '환율일자';
        exrate_type_code          : String(30)          @title : '환율유형코드';
        exrate                    : Decimal             @title : '환율';
        base_price_currency_code  : String(3)           @title : '기준단가통화코드';
        base_price                : Decimal             @title : '기준단가';
        sample_po_flag            : Boolean             @title : '샘플구매오더여부';
        temp_price_flag           : Boolean             @title : '임시가격여부';
        user_item_type_code       : String(30)          @title : '사용자품목유형코드';
        develope_person_empno     : String(30)          @title : '개발담당자사번';
        subcon_flag               : Boolean             @title : '하도급여부';
        po_net_price              : Decimal             @title : '구매오더단가';
        po_order_date             : Date                @title : '구매오더발주일자';
        po_currency_code          : String(3)           @title : '구매오더통화코드';
        transaction_creation_date : Date                @title : '트랜잭션생성일자';

}


extend VI_Receipt_Txn_Hist with util.Managed;
annotate VI_Receipt_Txn_Hist with @title : '입고실적이력'  @description : '입고실적이력';
