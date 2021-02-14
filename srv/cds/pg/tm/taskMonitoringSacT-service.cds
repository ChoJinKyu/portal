//Table
//View
using{pg as PreMngt} from '../../../../db/cds/pg/tm/PG_TM_SAC_PENDING_PO_PRE_MNGT_VIEW-model';              //  미결PO사전관리
using{pg as ReceiptDelay} from '../../../../db/cds/pg/tm/PG_TM_SAC_PENDING_PO_RECEIPT_DELAY_VIEW-model';    //  미결PO정리지연
using{pg as CreationDelay} from '../../../../db/cds/pg/tm/PG_TM_SAC_FOREIGN_PO_CREATION_DELAY_VIEW-model';  //  외자PO생성지연

namespace pg;

@path : '/pg.taskMonitoringSacTService'
@cds.query.limit.max: 20000
service taskMonitoringSacTService {

    // Entity List
    // View List
    view TmSacPreMngtView @(title : '미결PO 사전 관리 View') as select from PreMngt.Tm_Sac_Pending_Po_Pre_Mngt_View;                    //  미결PO사전관리
    view TmSacReceiptDelayView @(title : '미결PO 정리 지연 View') as select from ReceiptDelay.Tm_Sac_Pending_Po_Receipt_Delay_View;     //  미결PO정리지연
    view TmSacCreationDelayView @(title : '외자PO 생성 지연 View') as select from CreationDelay.Tm_Sac_Foreign_Po_Creation_Delay_View;  //  외자PO생성지연
}