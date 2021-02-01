//cds-service sourcing-v4-service.cds
using {sp.Sc_Nego_Headers as negoHeaders} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Headers_View as negoHeadersView} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Item_Prices as negoItemPrices} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using {sp.Sc_Nego_Suppliers as negoSuppliers} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_SUPPLIERS-model';
using {sp.Sc_Nego_Headers_New_Record_View as negoHeadersNewRecordView} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS_NEW_RECORD_VIEW-model';
/* using {
    sp.Sc_Outcome_Code as scOutcomeCode,
    sp.Sc_Nego_Type_Code as scNegoTypeCode,
    sp.Sc_Nego_Parent_Type_Code as scNegoParentTypeCode,
    sp.Sc_Award_Type_Code_View as scAwardTypeCodeView,
    sp.Sc_Nego_Prog_Status_Code_View as scNegoProgStatusCodeView,
} from '../../../../../db/cds/sp/sc/SP_SC_OUTCOME_CODE_VIEW-model'; */

namespace sp;

@path : '/sp.sourcingV4Service'
service SourcingV4Service {

    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */
    entity NegoHeaders @(title : '협상헤더정보')                    as projection on negoHeaders;
    /* 협상을 요청하기 위한 아이템의 가격정보를 관리한다. */
    entity NegoItemPrices @(title : '협상아이템정보')                as projection on negoItemPrices{ *,
    Header : redirected to NegoHeaders
    };
    /* 협상을 요청하기 위한 아이템별 협력업체정보를 관리한다. */
    entity NegoSuppliers @(title : '협상아이템업체정보')               as projection on negoSuppliers;
    /* 협상에 대한 헤더 정보의 신규 레코드 초기 값 레코드를 생성한다. */
    entity NegoHeadersNewRecordView @(title : '협상헤더정보-신규레코드') as projection on negoHeadersNewRecordView;

    // view NegoHeadersView as select from negoHeadersView;
    entity NegoHeadersView as projection on negoHeadersView;
    // @odata.draft.enabled

    /* 마스터 @cds.autoexpose entity //> master association 생략 가능
    entity ScOutcomeCode @(title : 'OutcomCode')              as projection on scOutcomeCode;
    entity ScNegoTypeCode @(title : '협상유형코드')                 as projection on scNegoTypeCode;
    entity ScNegoParentTypeCode @(title : '협상유형코드')           as projection on scNegoParentTypeCode;
    entity ScAwardTypeCodeView @(title : 'AwardTypeCode')     as projection on scAwardTypeCodeView;
    entity ScNegoProgStatusCodeView @(title : '협상상태코드')       as projection on scNegoProgStatusCodeView;
    */ 


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
