using { ep as forexDeclaration } from '../../../../db/cds/ep/poApprMgr/EP_PO_FOREX_DECLARATION-model';

namespace ep;
@path : 'ep.PoApprMgrService'
service PoApprMgrService {
    entity ForexDeclaration as projection on forexDeclaration.Po_Forex_Declaration;
	
}