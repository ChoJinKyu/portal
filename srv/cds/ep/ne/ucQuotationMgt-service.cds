using {ep as quotationMst} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_MST-model';
using {ep as quotationDtl} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_DTL-model';
using {ep as quotationCost} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_COST-model';
using {ep as quotationExtra} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_EXTRA-model';
using {ep as costItem} from '../../../../db/cds/ep/ne/EP_UC_COST_ITEM-model';

using { ep as ucQuotationListView} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_LIST_VIEW-model';

namespace ep;

@path : 'ep.UcQuotationMgtService'
service UcQuotationMgtService {
    entity UcQuotationMst   as projection on quotationMst.Uc_Quotation_Mst;
    entity UcQuotationDtl   as projection on quotationDtl.Uc_Quotation_Dtl;
    entity UcQuotationCost  as projection on quotationCost.Uc_Quotation_Cost;
    entity UcQuotationExtra as projection on quotationExtra.Uc_Quotation_Extra;
    entity UcCostItem       as projection on costItem.Uc_Cost_Item;

    entity UcQuotationListView as projection on ucQuotationListView.Uc_Quotation_List_View;

}
