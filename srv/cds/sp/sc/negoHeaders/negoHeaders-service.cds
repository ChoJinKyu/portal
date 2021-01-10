using { sp.Sc_Nego_Headers as negotHeaders } from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using { sp.Sc_Nego_Item_Prices as negoItemPrices } from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using { sp.Sc_Nego_Suppliers as negoSuppliers } from '../../../../../db/cds/sp/sc/SP_SC_NEGO_SUPPLIERS-model';

namespace sp; 
@path : '/sp.negoHeadersService'
service NegoHeadersService {

    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */
    entity NegotHeaders as projection on negotHeaders;
    
    /* 협상을 요청하기 위한 아이템의 가격정보를 관리한다. */
    entity NegoItemPrices as projection on negoItemPrices;

    /* 협상을 요청하기 위한 아이템별 협력업체정보를 관리한다. */
    entity NegoSuppliers as projection on negoSuppliers;

}
