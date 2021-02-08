using { ep as poApprovalMst } from '../../../../db/cds/ep/po/EP_PO_APPROVAL_MST-model';
using { ep as poApprovalPayment } from '../../../../db/cds/ep/po/EP_PO_APPROVAL_PAYMENT-model';
using { ep as forexDeclaration } from '../../../../db/cds/ep/cm/EP_PO_FOREX_DECLARATION-model';
using { ep as forexDeclarationView} from '../../../../db/cds/ep/cm/EP_PO_FOREX_DECLARATION_VIEW-model';

namespace ep;

@path : 'ep.PoApprMgtService'
service PoApprMgtService {

    entity PoApprovalMst as projection on poApprovalMst.Po_Approval_Mst;
    entity PoApprovalPayment as projection on poApprovalPayment.Po_Approval_Payment;

    entity ForexDeclaration as projection on forexDeclaration.Po_Forex_Declaration;
    entity ForexDeclarationView as projection on forexDeclarationView.Po_Forex_Declaration_View; 
    
}