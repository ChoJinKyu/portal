namespace sp;

using util from '../../cm/util/util-model';

entity VI_Cosp_Sales_Txn_Hist {
    key tenant_id                : String(5) not null  @title : '테넌트ID';
    key transaction_id           : Integer64 not null  @title : '트랜잭션아이디';
    key plant_code               : String(30) not null @title : '플랜트코드';
    key transaction_yyyymm       : String(6) not null  @title : '트랙잭션년월';
        company_code             : String(10) not null @title : '회사코드';
        au_code                  : String(10) not null @title : '회계단위코드';
        material_code            : String(40) not null @title : '자재코드';
        transaction_date         : Date(10) not null   @title : '트랜잭션일자';
        transaction_type_name    : String(50)          @title : '트랜잭션유형명';
        customer_code            : String(30) not null @title : '고객코드';
        customer_local_name      : String(240)         @title : '고객로컬명';
        supplier_code            : String(10)          @title : '공급업체코드';
        sales_net_price          : Decimal not null    @title : '매출단가';
        currency_code            : String(3) not null  @title : '통화코드';
        sales_quantity           : Decimal not null    @title : '매출수량';
        exrate_date              : Date                @title : '환율일자';
        exrate_type_code         : String(30)          @title : '환율유형코드';
        local_currency_code      : String(3)           @title : '로컬통화코드';
        sales_base_price         : Decimal             @title : '매출기준단가';
        sales_base_currency_code : String(3)           @title : '매출기준통화코드';
        transaction_create_date  : Date                @title : '트랜잭션생성일자';
        user_item_type_code      : String(30)          @title : '사용자품목유형코드';
}

extend VI_Cosp_Sales_Txn_Hist with util.Managed;
annotate VI_Cosp_Sales_Txn_Hist with @title : '유상사급판매이력'  @description : '유상사급판매이력';
