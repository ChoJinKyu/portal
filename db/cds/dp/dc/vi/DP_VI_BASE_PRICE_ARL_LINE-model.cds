namespace dp;

using util from '../../../util/util-model';
using {dp.VI_Base_Price_Arl_Header as header} from './DP_VI_BASE_PRICE_ARL_HEADER-model';

entity VI_Base_Price_Arl_Line {
    key tenant_id                     : String(5) not null   @title : '테넌트ID';
    key arl_number                    : String(100) not null @title : '품의서번호';
    key line_number                   : Decimal not null     @title : '회사코드';
        item_code                     : String(100) not null @title : '품목코드';
        supplier_code                 : String(100) not null @title : '공급업체코드';
        basic_date                    : Date not null        @title : '기준일자';
        new_dom_basic_price           : Decimal              @title : '신규내수기준단가';
        new_dom_basic_curr_code       : String(30)            @title : '신규내수기준통화코드';
        new_exp_basic_price           : Decimal              @title : '신규수출기준단가';
        new_exp_basic_curr_code       : String(30)            @title : '신규수출기준통화코드';
        curr_dom_basic_price          : String(30)            @title : '현재내수기준단가';
        curr_dom_basic_curr_code      : String(30)            @title : '현재내수기준통화코드';
        curr_exp_basic_price          : Decimal              @title : '현재수출기준단가';
        curr_exp_basic_curr_code      : String(30)            @title : '현재수출기준통화코드';
        dom_first_po_price            : Decimal              @title : '내수최초구매단가';
        dom_first_po_price_curr_code  : String(30)            @title : '내수최초구매단가통화코드';
        exp_first_po_price            : Decimal              @title : '수출최초구매단가';
        exp_first_po_price_curr_code  : String(30)            @title : '수출최초구매단가통화코드';
        dom_first_po_price_start_date : Date                 @title : '내수최초구매단가시작일자';
        exp_first_po_price_start_date : Date                 @title : '수출최초구매단가시작일자';

        parent                        : Association to header
                                            on  parent.tenant_id  = tenant_id
                                            and parent.arl_number = arl_number;
}

extend VI_Base_Price_Arl_Line with util.Managed;
