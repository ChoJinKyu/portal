namespace dp;

using util from '../../cm/util/util-model';
// using {dp.VI_Base_Price_Arl_Dtl as detail} from './DP_VI_BASE_PRICE_ARL_DTL-model';
// using {cm.Code_Dtl as code} from '../../cm/CM_CODE_DTL-model';
// using {cm.Org_Tenant as tenant} from '../../cm/CM_ORG_TENANT-model';

entity VI_Base_Price_Arl_Price {
    key tenant_id                        : String(5) not null;
    key approval_number                  : String(30) not null;
    key item_sequence                    : Decimal not null;
    key market_code                      : String(30) not null;
        new_base_price                   : Decimal(34,10);
        new_base_price_currency_code     : String(3);
        current_base_price               : Decimal(34,10);
        current_base_price_currency_code : String(3);
        first_purchasing_net_price       : Decimal(34,10);
        first_pur_netprice_curr_cd       : String(3);
        first_pur_netprice_str_dt        : Date;
        // change_reason_code               : String(30);

        // item_sequence_fk                 : Association to detail
        //                                        on  item_sequence_fk.tenant_id       = tenant_id
        //                                        and item_sequence_fk.approval_number = approval_number
        //                                        and item_sequence_fk.item_sequence   = item_sequence;
        // market_code_fk                   : Association to code
        //                                        on  market_code_fk.tenant_id  = tenant_id
        //                                        and market_code_fk.group_code = 'DP_VI_MARKET_CODE'
        //                                        and market_code_fk.code       = market_code;
        // tenant_id_fk                     : Association to tenant
        //                                        on tenant_id_fk.tenant_id = tenant_id;
}
extend VI_Base_Price_Arl_Price with util.Managed;

annotate VI_Base_Price_Arl_Price with @title : '품의 단가'  @description : '개발단가 품의 단가';
annotate VI_Base_Price_Arl_Price with {
    tenant_id                        @title : '테넌트ID'  @description      : '테넌트ID';
    approval_number                  @title : '품의번호'  @description       : '품의번호';
    item_sequence                    @title : '품목순번'  @description       : '품목순번';
    market_code                      @title : '납선코드'  @description       : '공통코드(CM_CODE_DTL, DP_VI_MARKET_CODE) : 0(Common), 1(Export), 2(Domestic)';
    new_base_price                   @title : '신규기준단가'  @description     : '신규기준단가';
    new_base_price_currency_code     @title : '신규기준단가통화코드'  @description : '신규기준단가통화코드';
    current_base_price               @title : '현재기준단가'  @description     : '현재기준단가';
    current_base_price_currency_code @title : '현재기준단가통화코드'  @description : '현재기준단가통화코드';
    first_purchasing_net_price       @title : '최초구매단가'  @description     : '최초구매단가';
    first_pur_netprice_curr_cd       @title : '최초구매단가통화코드'  @description : '최초구매단가통화코드';
    first_pur_netprice_str_dt        @title : '최초구매시작일자'  @description   : '최초구매시작일자';
    // change_reason_code               @title : '변경사유코드'  @description   : '공통코드(CM_CODE_DTL, DP_VI_CHANGE_REASON_CODE)';
};
