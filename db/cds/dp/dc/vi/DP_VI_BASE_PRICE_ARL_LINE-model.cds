namespace dp;

using util from '../../../util/util-model';
using {dp.VI_Base_Price_Arl_Header as header} from './DP_VI_BASE_PRICE_ARL_HEADER-model';
using {cm.Org_Tenant as tenant} from '../../../cm/orgMgr/CM_ORG_TENANT-model';

entity VI_Base_Price_Arl_Line {
    key tenant_id                                 : String(5) not null;
    key approval_number                           : String(50) not null;
    key line_number                               : Decimal not null;
        au_code                                   : String(10) not null;
        item_code                                 : String(100) not null;
        supplier_code                             : String(15);
        base_date                                 : Date not null;
        new_domestic_base_price                   : Decimal;
        new_domestic_base_currency_code           : String(3);
        new_export_base_price                     : Decimal;
        new_export_base_currency_price            : String(3);
        current_domestic_base_price               : Decimal;
        current_domestic_base_currency_code       : String(3);
        current_export_base_price                 : Decimal;
        current_export_base_currency_price        : String(3);
        domestic_first_pur_netprice               : Decimal;
        domestic_first_pur_netprice_currency_code : String(3);
        export_first_pur_netprice                 : Decimal;
        export_first_pur_netprice_currency_code   : String(3);
        domestic_first_pur_netprice_start_date    : Date;
        export_first_pur_netprice_start_date      : Date;

        approval_number_fk                        : Association to header
                                                        on  approval_number_fk.tenant_id       = tenant_id
                                                        and approval_number_fk.approval_number = approval_number;
        tenant_id_fk                              : Association to tenant
                                                        on tenant_id_fk.tenant_id = tenant_id;
}

extend VI_Base_Price_Arl_Line with util.Managed;

annotate VI_Base_Price_Arl_Line with @title : '개발단가품의목록'  @description : '개발단가품의목록';

annotate VI_Base_Price_Arl_Line with {
    tenant_id                                 @title : '테넌트ID'  @description        : '테넌트ID';
    approval_number                           @title : '품의번호'  @description         : '품의번호';
    line_number                               @title : '라인번호'  @description         : '라인번호';
    au_code                                   @title : '회계단위코드'  @description       : '회계단위코드';
    item_code                                 @title : '품목코드'  @description         : '품목코드';
    supplier_code                             @title : '공급업체코드'  @description       : '공급업체코드';
    base_date                                 @title : '기준일자'  @description         : '기준일자';
    new_domestic_base_price                   @title : '신규내수기준단가'  @description     : '신규내수기준단가';
    new_domestic_base_currency_code           @title : '신규내수기준통화코드'  @description   : '신규내수기준통화코드';
    new_export_base_price                     @title : '신규수출기준단가'  @description     : '신규수출기준단가';
    new_export_base_currency_price            @title : '신규수출기준통화코드'  @description   : '신규수출기준통화코드';
    current_domestic_base_price               @title : '현재내수기준단가'  @description     : '현재내수기준단가';
    current_domestic_base_currency_code       @title : '현재내수기준통화코드'  @description   : '현재내수기준통화코드';
    current_export_base_price                 @title : '현재수출기준단가'  @description     : '현재수출기준단가';
    current_export_base_currency_price        @title : '현재수출기준통화코드'  @description   : '현재수출기준통화코드';
    domestic_first_pur_netprice               @title : '내수최초구매단가'  @description     : '내수최초구매단가';
    domestic_first_pur_netprice_currency_code @title : '내수최초구매단가통화코드'  @description : '내수최초구매단가통화코드';
    export_first_pur_netprice                 @title : '수출최초구매단가'  @description     : '수출최초구매단가';
    export_first_pur_netprice_currency_code   @title : '수출최초구매단가통화코드'  @description : '수출최초구매단가통화코드';
    domestic_first_pur_netprice_start_date    @title : '내수최초구매단가시작일자'  @description : '내수최초구매단가시작일자';
    export_first_pur_netprice_start_date      @title : '수출최초구매단가시작일자'  @description : '수출최초구매단가시작일자';
}
