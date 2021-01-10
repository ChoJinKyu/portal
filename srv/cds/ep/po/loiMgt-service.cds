using { ep as loiMst } from '../../../../db/cds/ep/po/EP_LI_MST-model';
using { ep as loiDtl } from '../../../../db/cds/ep/po/EP_LI_DTL-model';
using { ep as loiVd } from '../../../../db/cds/ep/po/EP_LI_SUPPLIER-model';
using { ep as loiVdSel } from '../../../../db/cds/ep/po/EP_LI_SUPPLIER_SELECTION-model';
using { ep as loiPub } from '../../../../db/cds/ep/po/EP_LI_PUBLISH-model';
using { ep as loiPubItemView } from '../../../../db/cds/ep/po/EP_LI_PUBLISH_ITEM_VIEW-model';
using { ep as loiSupplySelView } from '../../../../db/cds/ep/po/EP_LI_SUPPLY_SELECTION_VIEW-model';
using { ep as loiReqDetailView} from '../../../../db/cds/ep/po/EP_LI_REQUEST_DETAIL_VIEW-model';
using { ep as loiReqListView} from '../../../../db/cds/ep/po/EP_LI_REQUEST_LIST_VIEW-model';
using { ep as loiPubView } from '../../../../db/cds/ep/po/EP_LI_PUBLISH_VIEW-model';

//Unit Code
using {cm.Currency_Lng as CurrencyLanguage} from '../../../../db/cds/cm/CM_CURRENCY_LNG-model';

namespace ep;

@path : 'ep.LoiMgtService'
service LoiMgtService {
    entity LoiMst as projection on loiMst.Li_Mst;
    entity LoiDtl as projection on loiDtl.Li_Dtl;
    entity LoiVendor as projection on loiVd.Li_Supplier;
    entity LoiVendorSelection as projection on loiVdSel.Li_Supplier_Selection;
    entity LoiPublish as projection on loiPub.Li_Publish;	
	
	entity LOIPublishItemView as projection on loiPubItemView.Li_Publish_Item_View;	
    entity LOIRequestDetailView as projection on loiReqDetailView.Li_Request_Detail_View;
    entity LOIRequestListView as projection on loiReqListView.Li_Request_List_View;
    entity LOISupplySelectionView as projection on loiSupplySelView.Li_Supply_Selection_View;	
    entity LOIPublishView as projection on loiPubView.Li_Publish_View;	

    view LoiNumberGroupbyView as
        select
        key tenant_id,
        key company_code,
        key loi_number
        from loiMst.Li_Mst 
        group by tenant_id, company_code, loi_number;

    // Currency Unit View
     view CurrencyUnitView @(title : '통화단위코드 View') as 
         select
         key tenant_id,          //회사코드
         key currency_code,      //통화단위코드
         key language_code,      //언어코드
             currency_code_name  //통화단위코드명
         from CurrencyLanguage
         where
             language_code = 'KO';

}
