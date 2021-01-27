using {ep as approvalMst} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_MST-model';
using {ep as approvalDtl} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_DTL-model';
using {ep as approvalExtra} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_EXTRA-model';
using {ep as approvalSupplier} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_SUPPLIER-model';
using {ep as extraClass} from '../../../../db/cds/ep/ne/EP_UC_EXTRA_CLASS-model';
using {ep as extraItem} from '../../../../db/cds/ep/ne/EP_UC_EXTRA_ITEM-model';
using {ep as item} from '../../../../db/cds/ep/ne/EP_UC_ITEM-model';
using {ep as itemClass} from '../../../../db/cds/ep/ne/EP_UC_ITEM_CLASS-model';

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
}