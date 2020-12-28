using { ep as forexDeclaration } from '../../../../db/cds/ep/cm/EP_PO_FOREX_DECLARATION-model';
using { ep as forexDeclarationView} from '../../../../db/cds/ep/cm/EP_PO_FOREX_DECLARATION_VIEW-model';

namespace ep;

@path : 'ep.PoApprMgtService'
service PoApprMgtService {
    entity ForexDeclaration as projection on forexDeclaration.Po_Forex_Declaration;
    entity ForexDeclarationView as projection on forexDeclarationView.Po_Forex_Declaration_View; 
}