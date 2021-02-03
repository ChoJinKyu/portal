using {ep as approvalMst} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_MST-model';
using {ep as approvalDtl} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_DTL-model';
using {ep as approvalExtra} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_EXTRA-model';
using {ep as approvalSupplier} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_SUPPLIER-model';
using {ep as extraClass} from '../../../../db/cds/ep/ne/EP_UC_EXTRA_CLASS-model';
using {ep as extraItem} from '../../../../db/cds/ep/ne/EP_UC_EXTRA_ITEM-model';
using {ep as item} from '../../../../db/cds/ep/ne/EP_UC_ITEM-model';
using {ep as itemClass} from '../../../../db/cds/ep/ne/EP_UC_ITEM_CLASS-model';
using {ep as approvalDtlView} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_DTL_VIEW-model';
using {ep as approvalMstView} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_MST_VIEW-model';
using {ep as approvalMstDetailView} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_MST_DETAIL_VIEW-model';
using {ep as approvalDtlDetailView} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_DTL_DETAIL_VIEW-model';
using {ep as approvalSupplierDetailView} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_SUPPLIER_DETAIL_VIEW-model';
using {ep as approvalExtraDetailView} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_EXTRA_DETAIL_VIEW-model';
using {ep as itemView} from '../../../../db/cds/ep/ne/EP_UC_ITEM_VIEW-model';

namespace ep;

@path : 'ep.UcContractMgtService'
service UcContractMgtService {
    entity UcApprovalMst      as projection on approvalMst.Uc_Approval_Mst;
    entity UcApprovalDtl      as projection on approvalDtl.Uc_Approval_Dtl;
    entity UcApprovalExtra    as projection on approvalExtra.Uc_Approval_Extra;
    entity UcApprovalSupplier as projection on approvalSupplier.Uc_Approval_Supplier;
    entity UcExtraClass       as projection on extraClass.Uc_Extra_Class;
    entity UcExtraItem        as projection on extraItem.Uc_Extra_Item;
    entity UcItem             as projection on item.Uc_Item;
    entity UcItemClass        as projection on itemClass.Uc_Item_Class;
    entity UcApprovalDtlView  as projection on approvalDtlView.Uc_Approval_Dtl_View;
    entity UcApprovalMstView  as projection on approvalMstView.Uc_Approval_Mst_View;
    entity UcApprovalMstDetailView  as projection on approvalMstDetailView.Uc_Approval_Mst_Detail_View;
    entity UcApprovalDtlDetailView  as projection on approvalDtlDetailView.Uc_Approval_Dtl_Detail_View;
    entity UcApprovalSupplierDetailView  as projection on approvalSupplierDetailView.Uc_Approval_Supplier_Detail_View;
    entity UcApprovalExtraDetailView  as projection on approvalExtraDetailView.Uc_Approval_Extra_Detail_View;
    entity UcItemView  as projection on itemView.Uc_Item_View;

}
