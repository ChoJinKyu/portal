using {sp.Sc_Nego_Headers as negoHeaders} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Item_Prices as negoItemPrices} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using {sp.Sc_Nego_Suppliers as negoSuppliers} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_SUPPLIERS-model';

using {
    sp.Sc_Tester00 as tester00,
    sp.Sc_Nego_Headers_Test01 as negoHeadersTest01
} from '../../../../../db/cds/sp/sc/SP_SC_00TESTER-model';

namespace sp;

@path : '/sp.sourcingV4Service'
service SourcingV4Service {

    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */
    entity NegoHeaders @(title : '협상헤더정보')      as projection on negoHeaders;
    /* 협상을 요청하기 위한 아이템의 가격정보를 관리한다. */
    entity NegoItemPrices @(title : '협상아이템정보')  as projection on negoItemPrices;
    /* 협상을 요청하기 위한 아이템별 협력업체정보를 관리한다. */
    entity NegoSuppliers @(title : '협상아이템업체정보') as projection on negoSuppliers;
    // Test
    entity Tester00                             as projection on tester00;
    entity NegoHeadersTest01                    as projection on negoHeadersTest01;

    // type tyNegoHeaders : negoHeaders;
    // type tyNegoItemPrices : negoItemPrices;
    // type tyNegoSuppliers : negoSuppliers;

    // type negoDeepUpsertIn : {
    //     negoHeaders    : array of negoHeaders;
    //     negoItemPrices : array of negoItemPrices;
    //     negoSuppliers  : array of negoSuppliers;
    // };

    // type negoDeepUpsertOut : {
    //     returncode    : String(2);
    //     returnmessage : String(500);
    // };
    
    // action upsertSourcingNegoProc(InputData : negoDeepUpsertIn) returns array of negoDeepUpsertOut;

}
