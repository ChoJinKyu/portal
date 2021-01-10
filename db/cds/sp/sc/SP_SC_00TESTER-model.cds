namespace sp;

using util from '../../cm/util/util-model';
using cm from '../../../../db/cds/cm/CM_CURRENCY_LNG-model';
// using {sp as partCategory} from '../netPrice/SP_NP_NET_PRICE_MST-model';

entity Sc_Tester00 : util.Managed {
    key tenant_id                       : String(5) not null              @title : '테넌트ID';
    key company_code                    : String(10) default '*' not null @title : '회사코드';
    key org_type_code                   : String(2) default 'PL' not null @title : '구매운영조직유형';
    key org_code                        : String(10) not null             @title : '구매운영조직코드';
        effective_end_date              : String(8)                       @title : '유효종료일자';
        payterms_code                   : String(30)                      @title : '지불조건코드';
}

view Sc_Language as select 
*
,$user.locale               as locale
,$user.id                   as user_id
,$at.from                   as at_from
,$at.to                     as at_to
,$now                       as now
,$projection.language_code  as projection_language_code
,$self.language_code        as self_language_code
// ,$session                   as session
from cm.Currency_Lng ;

 
/*  Deployed
    SELECT
    *,
    SESSION_CONTEXT('LOCALE') AS locale,
    SESSION_CONTEXT('APPLICATIONUSER') AS user_id,
    SESSION_CONTEXT('VALID-FROM') AS at_from,
    SESSION_CONTEXT('VALID-TO') AS at_to,
    CURRENT_TIMESTAMP AS now,
    Currency_Lng_0.language_code AS projection_language_code,
    Currency_Lng_0.language_code AS self_language_code
    FROM cm_Currency_Lng AS Currency_Lng_0; */