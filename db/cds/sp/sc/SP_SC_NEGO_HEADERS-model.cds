namespace sp;

using util from '../../cm/util/util-model';
using cm from '../../../../db/cds/cm/CM_CURRENCY_LNG-model';
// using {sp as partCategory} from '../netPrice/SP_NP_NET_PRICE_MST-model';

entity Sc_Nego_Headers : util.Managed {
    key tenant_id                       : String(5) not null              @title : '테넌트ID';
    key company_code                    : String(10) default '*' not null @title : '회사코드';
    key org_type_code                   : String(2) default 'PL' not null @title : '구매운영조직유형';
    key org_code                        : String(10) not null             @title : '구매운영조직코드';
        effective_end_date              : String(8)                       @title : '유효종료일자';
        payterms_code                   : String(30)                      @title : '지불조건코드';
}
view Sc_Language as select * from cm.Currency_Lng where language_code = $user.locale;