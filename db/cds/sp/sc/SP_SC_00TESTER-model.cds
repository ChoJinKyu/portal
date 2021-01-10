namespace sp;

using util from '../../cm/util/util-model';
using cm from '../../../../db/cds/cm/CM_CURRENCY_LNG-model';
// using {sp as partCategory} from '../netPrice/SP_NP_NET_PRICE_MST-model';

entity Sc_Tester00 : util.Managed {
    key tenant_id          : String(5) not null              @title : '테넌트ID';
    key company_code       : String(10) default '*' not null @title : '회사코드';
    key org_type_code      : String(2) default 'PL' not null @title : '구매운영조직유형';
    key org_code           : String(10) not null             @title : '구매운영조직코드';
        effective_end_date : String(8)                       @title : '유효종료일자';
        payterms_code      : String(30)                      @title : '지불조건코드';
}

view Sc_Language as
    select
        *,
        $user.locale              as locale,
        $user.id                  as user_id,
        $at.from                  as at_from,
        $at.to                    as at_to,
        $now                      as now,
        $projection.language_code as projection_language_code,
        $self.language_code       as self_language_code
        // ,$session                   as session
    from cm.Currency_Lng;

using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model.cds';
using {managed} from '@sap/cds/common';

entity Sc_Nego_Headers_Test01 : managed {
        // key tenant_id                       : String(5) not null  @title : '테넌트ID';
    key tenant_id                : Association to orgTenant.Org_Tenant @title : '테넌트ID';
    key nego_header_id           : Integer64 not null                  @title : '협상헤더ID';
        operation_unit_code      : String(30) not null                 @title : '운영단위코드';
        reference_nego_header_id : Integer64                           @title : '참조협상헤더ID';
        previous_nego_header_id  : Integer64                           @title : '기존협상헤더ID';
        nego_document_round      : Integer                             @title : '협상문서회차';
        nego_document_number     : String(50)                          @title : '협상문서번호';
        nego_document_title      : String(300)                         @title : '협상문서제목';
}


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
