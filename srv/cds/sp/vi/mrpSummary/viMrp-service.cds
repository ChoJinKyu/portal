using {sp.Vi_Mrp_Summary as MrpSummary} from '../../../../../db/cds/sp/vi/SP_VI_MRP_SUMMARY-model.cds';
using {dp.Mm_Material_Mst as materialMst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Org as materialOrg} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {dp.Mm_Material_Class as materialCalss} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS-model';
using {cm.Code_Dtl as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
/*using {dp.Mm_Mtl_Commodity_View as materialCmdt} from '../../../../../db/cds/dp/mm/DP_MM_MTL_COMMODITY_VIEW-model'; */


namespace sp;

@path : '/sp.MrpSummaryService'
@readonly
service MrpService {
    view MrpView as
        select
            key mrp.tenant_id,
            key mrp.plant_code,
            key mrp.material_code,
                mmm.material_type_code,
                mmo.user_item_type_code as uit : String(10),
                mmm.material_class_code,
                mmc.material_class_name,
                mrp.stock_qty,
                mrp.mm_1_req_qty,
                mrp.mm_2_req_qty,
                mrp.mm_3_req_qty,
                mrp.mm_4_req_qty,
                mrp.mm_5_req_qty,
                mrp.mm_6_req_qty,
                mrp.mm_7_req_qty,
                mrp.mm_8_req_qty,
                mrp.mm_9_req_qty,
                mrp.mm_10_req_qty,
                mrp.mm_11_req_qty,
                mrp.mm_12_req_qty,
                mmm.material_desc,
                mmm.base_uom_code       as uom : String(3),
                mmm.material_spec
        from MrpSummary mrp
        join materialMst mmm
            on(
                mrp.tenant_id = mmm.tenant_id
                and mrp.material_code = mmm.material_code
            )
        join materialOrg mmo
            on(
                mrp.tenant_id = mmo.tenant_id
                and mrp.plant_code = mmo.org_code
                and mrp.material_code = mmo.material_code
            )
        left outer join materialCalss mmc
            on(
                mmm.tenant_id = mmc.tenant_id
                and mmm.material_class_code = mmc.material_class_code
            )
        left outer join codeDtl cd
            on(
                mmm.tenant_id = cd.tenant_id
                and mmm.material_type_code = cd.code
                and cd.group_code = 'MATERIAL_TYPE_CODE'
            )
    };

