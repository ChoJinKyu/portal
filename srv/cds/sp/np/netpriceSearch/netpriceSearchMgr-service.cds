using { sp as spNetprice } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_MST-model';

namespace sp; 
@path : '/sp.netpriceSearchService'
service NpSearchService {
    entity SpNetprice as projection on spNetprice.Np_Net_Price_Mst;
    view SpNpNetpriceview as 
    select tenant_id
           ,company_code
           , org_type_code
           , org_code
           , net_price_document_type_code
           , net_price_source_code
           , net_price_sequence
           , supplier_code
           , material_code
           , market_code
           , effective_start_date
           , effective_end_date
           , net_price
      from spNetprice.Np_Net_Price_Mst;

}