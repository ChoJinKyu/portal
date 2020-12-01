namespace dp;

using util from '../../../cm/util/util-model';
using {dp.VI_Base_Price_Arl_Dtl as detail} from './DP_VI_BASE_PRICE_ARL_DTL-model';
using {cm.Org_Tenant as tenant} from '../../../cm/orgMgr/CM_ORG_TENANT-model';

entity VI_Base_Price_Arl_Price {
    key tenant_id                   : String(5) not null;
    key approval_number             : String(50) not null;
    key item_sequence               : Decimal not null;
    key net_price_separated_code    : String(30) not null;
        new_base_price              : Decimal;
        new_currency_code           : String(3);
        current_base_price          : Decimal;
        current_currency_code       : String(3);
        first_purchasing_net_price  : Decimal;
        first_currency_code         : String(3);
        first_purchasing_start_date : Date;

        item_sequence_fk            : Association to detail
                                          on  item_sequence_fk.tenant_id       = tenant_id
                                          and item_sequence_fk.approval_number = approval_number
                                          and item_sequence_fk.item_sequence   = item_sequence;
        tenant_id_fk                : Association to tenant
                                          on tenant_id_fk.tenant_id = tenant_id;
}

extend VI_Base_Price_Arl_Price with util.Managed;
annotate VI_Base_Price_Arl_Price with @title : '품의 단가'  @description : '개발단가 품의 단가';

annotate VI_Base_Price_Arl_Price with {
    tenant_id                   @title : '테넌트ID'  @description    : '테넌트ID';
    approval_number             @title : '품의번호'  @description     : '품의번호';
    item_sequence               @title : '품목순번'  @description     : '품목순번';
    net_price_separated_code    @title : '단가구분코드'  @description   : '공통코드(CM_CODE_DTL, DP_DC_NET_PRICE_SEPARATED_CODE) : 10(내수), 20(수출)';
    new_base_price              @title : '신규기준단가'  @description   : '신규기준단가';
    new_currency_code           @title : '신규통화코드'  @description   : '신규통화코드';
    current_base_price          @title : '현재기준단가'  @description   : '현재기준단가';
    current_currency_code       @title : '현재통화코드'  @description   : '현재통화코드';
    first_purchasing_net_price  @title : '최초구매단가'  @description   : '최초구매단가';
    first_currency_code         @title : '최초통화코드'  @description   : '최초통화코드';
    first_purchasing_start_date @title : '최초구매시작일자'  @description : '최초구매시작일자';
}
