namespace dp;

using util from '../../cm/util/util-model';
/** 금형분할결제 */
entity Md_Partial_Payment {
    key tenant_id         : String(5)   not null @title : '테넌트ID';
    key mold_id           : String(100) not null @title : '금형ID';
    key pay_sequence      : String(10)  not null @title : '대금지급순번';
        pay_type_code     : String(10)           @title : '대금지급유형코드';
        pay_rate          : Decimal(20, 2)       @title : '지급비율';
        pay_price         : Decimal(20, 2)       @title : '지급금액';
}

extend Md_Partial_Payment with util.Managed;