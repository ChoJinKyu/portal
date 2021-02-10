namespace op;
//  기본 데이터 정리..
using {op.Pu_Pr_Mst as prMst}               from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';
using {op.Pu_Pr_Dtl as prDtl}               from '../../../../../db/cds/op/pu/pr/OP_PU_PR_DTL-model';
using {op.Pu_Pr_Account as prAccount}       from '../../../../../db/cds/op/pu/pr/OP_PU_PR_ACCOUNT-model';
using {op.Pu_Pr_Service as prService}       from '../../../../../db/cds/op/pu/pr/OP_PU_PR_SERVICE-model';

using {op.Pu_Pr_Template_Mst as prTMst}     from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_MST-model';
using {op.Pu_Pr_Template_Dtl as prTDtl}     from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_DTL-model';
using {op.Pu_Pr_Template_Map as prTMap}     from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_MAP-model';
using {op.Pu_Pr_Template_Lng as prTLng}     from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_LNG-model';
using {op.Pu_Pr_Template_Ett as prTEtt}     from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_ETT-model';
using {op.Pu_Pr_Template_Txn as prTXtn}     from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_TXN-model';

using {op.Pu_Account_Mst as AccountMst}     from '../../../../../db/cds/op/pu/account/OP_PU_ACCOUNT_MST-model';
using {op.Pu_Asset_Mst as AssetMst}         from '../../../../../db/cds/op/pu/asset/OP_PU_ASSET_MST-model';
using {op.Pu_Cctr_Mst as CctrMst}           from '../../../../../db/cds/op/pu/cctr/OP_PU_CCTR_MST-model';
using {op.Pu_Order_Mst as OrderMst}         from '../../../../../db/cds/op/pu/order/OP_PU_ORDER_MST-model';
using {op.Pu_Wbs_Mst as WbsMst}             from '../../../../../db/cds/op/pu/wbs/OP_PU_WBS_MST-model';

using {cm.Hr_Department as Dept}            from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {cm.Code_Lng as cdLng}                from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm.Org_Purchasing_Group as purchasingGroup}  from '../../../../../db/cds/cm/CM_ORG_PURCHASING_GROUP-model';


@path : '/op.util.MstService'
service MstService {
    
    entity Cm_purchasingGroup   as projection on purchasingGroup;


    entity Pr_Mst     as projection on op.Pu_Pr_Mst;
    entity Pr_Dtl     as projection on op.Pu_Pr_Dtl;
    entity Pr_Account as projection on op.Pu_Pr_Account;
    entity Pr_Service as projection on op.Pu_Pr_Service;

    entity Pr_TMst as projection on op.Pu_Pr_Template_Mst;
    entity Pr_TDtl as projection on op.Pu_Pr_Template_Dtl;
    entity Pr_TMap as projection on op.Pu_Pr_Template_Map;
    entity Pr_TLng as projection on op.Pu_Pr_Template_Lng;
    entity Pr_TEtt as projection on op.Pu_Pr_Template_Ett;
    entity Pr_TXtn as projection on op.Pu_Pr_Template_Txn;

    entity Account_Mst as projection on op.Pu_Account_Mst;
    entity Asset_Mst as projection on op.Pu_Asset_Mst;
    entity Cctr_Mst as projection on op.Pu_Cctr_Mst;
    entity Order_Mst as projection on op.Pu_Order_Mst;
    entity Wbs_Mst as projection on op.Pu_Wbs_Mst;

   
}
