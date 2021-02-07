//cds-service sourcingTest01-v4-service.cds
using {sp.Sc_Nego_Headers as negoHeaders} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Item_Prices as negoItemPrices} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using {sp.Sc_Nego_Suppliers as negoSuppliers} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_SUPPLIERS-model';
using {sp.Sc_Nego_Headers_New_Record_View as negoHeadersNewRecordView} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS_NEW_RECORD_VIEW-model';

// using {sp.Sc_Outcome_Code2 as scOutcomeCode2} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_MASTERS-model';
// using {localized.Sc_Outcome_Code as scOutcomeCodeLocalized} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_MASTERS-model'; //작동안함

using {
    sp.Sc_Nego_Outcom as scNegoOutcom,
    // sp.Sc_salesOrderCountryOwnAndGer as scSalesOrderCountryOwnAndGer,
    sp.Sc_Contacts as scContacts,
    sp.Sc_Contacts2,
    sp.Sc_Tester00 as scTester00,
    sp.Sc_Language as scLanguage,
    // sp.Sc_Nego_Headers_Test01 as negoHeadersTest01,
    sp.Sc_Nego_Headers_Test04 as negoHeadersTest04,
    sp.Sc_Test_Session_Context
} from '../../../../../db/cds/sp/sc/SP_SC_00TESTER-model';

namespace sp;

@path : '/sp.sourcingTest01V4Service'
service SourcingTest01V4Service {

    entity ScContacts  @(title : '아웃컴테스트')                         as projection on scContacts;
    entity ScContacts2 @(title : '아웃컴테스트2')                       as projection on Sc_Contacts2;
    // entity SalesOrderCountryOwnAndGer @(title : '아웃컴테스트')                 as projection on scSalesOrderCountryOwnAndGer;
    entity ScNegoOutcom @(title : '아웃컴테스트')                   as projection on scNegoOutcom;
    // entity NegoHeadersTest01                                  as projection on negoHeadersTest01;
    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */
    // @odata.draft.enabled
    // entity NegoHeaders @(title : '협상헤더정보')                    as projection on negoHeaders;
    // /* 협상을 요청하기 위한 아이템의 가격정보를 관리한다. */
    // entity NegoItemPrices @(title : '협상아이템정보')                as projection on negoItemPrices;
    // /* 협상을 요청하기 위한 아이템별 협력업체정보를 관리한다. */
    // entity NegoSuppliers @(title : '협상아이템업체정보')               as projection on negoSuppliers;
    // /* 협상에 대한 헤더 정보의 신규 레코드 초기 값 레코드를 생성한다. */
    // entity NegoHeadersNewRecordView @(title : '협상헤더정보-신규레코드') as projection on negoHeadersNewRecordView;
    //** Test - Begin **/
    entity Tester00                                           as projection on scTester00;
    entity ScLanguage                                         as projection on scLanguage;

    @odata.draft.enabled
    entity NegoHeadersTest04                                  as projection on negoHeadersTest04;

    // // @odata.draft.enabled
    // entity ScOutcomeCode                                      as projection on scOutcomeCode;
    // entity ScNegoTypeCode                                     as projection on scNegoTypeCode;

    entity ScTestSessionContext                               as projection on Sc_Test_Session_Context;
    // entity ScNegoProgStatusCodeView                           as projection on scNegoProgStatusCodeView;

    //    sp.Sc_Nego_Type_Code as scNegoTypeCode,
    //    sp.Sc_Award_Type_Code_View as scAwardTypeCodeView,
    //    sp.Sc_Award_Type_Code_View2 as scAwardTypeCodeView2,
    //    sp.Sc_Award_Type_Code_View3 as scAwardTypeCodeView3,
    //    sp.Sc_Nego_Prog_Status_Code_View as scNegoProgStatusCodeView,

    // entity ScOutcomeCodeLocalized0                           as projection on scOutcomeCodeLocalized ;

    // BEGIN TEST - CDS Localized 
    // entity ScOutcomeCodeLocalized                             as projection on scOutcomeCode {
    //     * , texts.outcome_name as localized_nego_type_name
    // } ;
    // entity ScOutcomeCodeLocalized2                             as projection on scOutcomeCode {
    //     * , texts.outcome_name as localized_nego_type_name, texts.locale
    // } ;
    // entity ScOutcomeCodeLocalized3                             as projection on scOutcomeCode {
    //     * , localized.outcome_name as localized_nego_type_name
    // } ;
    // entity ScOutcomeCodeLocalized4                             as projection on scOutcomeCode {
    //     * , localized.outcome_name as localized_nego_type_name, localized.locale
    // } ;

    // entity ScOutcomeCode2                             as projection on scOutcomeCode2 {
    //     * , localized.nego_type_name as localized_nego_type_name
    // } ;
    // END TEST - CDS Localized 


// extend ScOutcomeCode with {
//     texts.nego_type_name
// }
// ;
// entity ScOutcomeCode_Localized                                      as projection on scOutcomeCode_localized ;


/* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */

//** Test - End   **/

// type tyNegoHeaders : NegoHeaders;
// type tyNegoItemPrices : NegoItemPrices;
// type tyNegoSuppliers : NegoSuppliers;

// type negoDeepUpsertIn : {
//     negoHeaders    : array of tyNegoHeaders;
//     negoItemPrices : array of tyNegoItemPrices;
//     negoSuppliers  : array of tyNegoSuppliers;
// };

// type negoDeepUpsertOut : {
//     returncode    : String(2);
//     returnmessage : String(500);
// };

// action upsertSourcingNegoProc(InputData : negoDeepUpsertIn) returns array of negoDeepUpsertOut;

}
