namespace dp;

using util from '../../../util/util-model';
using {dp.VI_Base_Price_Arl_Header as header} from './DP_VI_BASE_PRICE_ARL_HEADER-model';

entity VI_Base_Price_Arl_Line {
    key tenant_id                                 : String(5) not null   @title : '테넌트ID';
    key approval_number                           : String(50) not null  @title : '품의번호';
    key line_number                               : Decimal not null     @title : '라인번호';
        au_code                                   : String(10) not null  @title : '회계단위코드';
        item_code                                 : String(100) not null @title : '품목코드';
        supplier_code                             : String(15)           @title : '공급업체코드';
        base_date                                 : Date not null        @title : '기준일자';
        new_domestic_base_price                   : Decimal              @title : '신규내수기준단가';
        new_domestic_base_currency_code           : String(3)            @title : '신규내수기준통화코드';
        new_export_base_price                     : Decimal              @title : '신규수출기준단가';
        new_export_base_currency_price            : String(3)            @title : '신규수출기준통화코드';
        current_domestic_base_price               : Decimal              @title : '현재내수기준단가';
        current_domestic_base_currency_code       : String(3)            @title : '현재내수기준통화코드';
        current_export_base_price                 : Decimal              @title : '현재수출기준단가';
        current_export_base_currency_price        : String(3)            @title : '현재수출기준통화코드';
        domestic_first_pur_netprice               : Decimal              @title : '내수최초구매단가';
        domestic_first_pur_netprice_currency_code : String(3)            @title : '내수최초구매단가통화코드';
        export_first_pur_netprice                 : Decimal              @title : '수출최초구매단가';
        export_first_pur_netprice_currency_code   : String(3)            @title : '수출최초구매단가통화코드';
        domestic_first_pur_netprice_start_date    : Date                 @title : '내수최초구매단가시작일자';
        export_first_pur_netprice_start_date      : Date                 @title : '수출최초구매단가시작일자';

        approval_number_fk                        : Association to header
                                                        on  approval_number_fk.tenant_id       = tenant_id
                                                        and approval_number_fk.approval_number = approval_number;
}

extend VI_Base_Price_Arl_Line with util.Managed;
