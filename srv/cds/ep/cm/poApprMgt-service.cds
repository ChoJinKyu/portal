using { ep as forexDeclaration } from '../../../../db/cds/ep/cm/EP_PO_FOREX_DECLARATION-model';

namespace ep;
@path : 'ep.PoApprMgtService'
service PoApprMgtService {
    entity ForexDeclaration as projection on forexDeclaration.Po_Forex_Declaration;
	
}