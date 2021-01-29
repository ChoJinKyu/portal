/**
 * * * *
 *
 * 1. namespace
 *
 * - 모듈코드 소문자로 작성
 * - 소모듈 존재시 대모듈.소모듈 로 작성
 *
 * 2. entity
 *
 * - 대문자로 작성
 * - 테이블명 생성을 고려하여 '\_' 추가
 *
 * 3. 컬럼(속성)
 *
 * - 소문자로 작성
 *
 * 4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에
 *    @cds.persistence.exists 명시
 *
 * 5. namespace : sp
 *
 * 6. entity : Vi_Mrp_R_If
 *
 * 7. entity description : MRP I/F Table
 *
 * 8. history -. 2021.01.13 : 이경상 최초작성
 *
 * * * *
 */

namespace sp;

using util from '../../cm/util/util-model';
// using {sp as viMrpR} from '../sp/SP_VI_MRP_R_IF-model';

entity Vi_Mrp_R_If {
    organization_id               : Decimal not null;
    mrp_execution_date            : Date not null;
    division_code                 : String(4) not null;
    affiliate_code                : String(4) not null;
    production_organization_code  : String(4) not null;
    part_no                       : String(40) not null;
    order_type                    : String(1);
    item_type                     : String(1);
    item_desc                     : String(240);
    item_spec                     : String(250);
    bucket_type_code              : String(10);
    raw_mtl_onhand                : Decimal;
    raw_wip_onhand                : Decimal;
    vmi_qty                       : Decimal;
    import_vmi_qty                : Decimal;
    minimum_order_quantity        : Decimal;
    maximum_order_quantity        : Decimal;
    class_code                    : String(30);
    class_code_desc               : String(150);
    price_term_code               : String(30);
    full_lead_time                : Decimal;
    primary_uom_code              : String(150);
    safety_stock_qty              : Decimal;
    safety_stock_days             : Decimal;
    safety_stock_percent          : Decimal;
    in_transit_qty                : Decimal;
    claim_qty                     : Decimal;
    fixed_lot_multiplier          : Decimal;
    planner_code                  : String(150);
    buyer_code                    : String(150);
    supplier1_code                : String(150);
    allocation1_rate              : String(150);
    supplier2_code                : String(150);
    allocation2_rate              : String(150);
    supplier3_code                : String(150);
    allocation3_rate              : String(150);
    supplier4_code                : String(150);
    allocation4_rate              : String(150);
    direct_purchase_flag          : String(1);
    forecast_qty                  : Decimal;
    item_po_remained_qty          : Decimal;
    order_remained_qty            : Decimal;
    domestic_unit_price           : Decimal;
    domestic_currency_code        : String(150);
    export_unit_price             : Decimal;
    export_currency_code          : String(150);
    flxfld1_start_date            : String(8);
    flxfld1_inventory_qty         : Decimal default 0;
    flxfld1_receiving_exp_qty     : Decimal;
    flxfld1_gross_req_qty         : Decimal default 0;
    flxfld1_overage_shortage_qty  : Decimal;
    flxfld1_item_po_qty           : Decimal;
    flxfld1_item_fcst_qty         : Decimal;
    flxfld2_inventory_qty         : Decimal;
    flxfld2_receiving_exp_qty     : Decimal;
    flxfld2_gross_req_qty         : Decimal default 0;
    flxfld2_overage_shortage_qty  : Decimal;
    flxfld2_item_po_qty           : Decimal;
    flxfld2_item_fcst_qty         : Decimal;
    flxfld3_inventory_qty         : Decimal;
    flxfld3_receiving_exp_qty     : Decimal;
    flxfld3_gross_req_qty         : Decimal default 0;
    flxfld3_overage_shortage_qty  : Decimal;
    flxfld3_item_po_qty           : Decimal;
    flxfld3_item_fcst_qty         : Decimal;
    flxfld4_inventory_qty         : Decimal;
    flxfld4_receiving_exp_qty     : Decimal;
    flxfld4_gross_req_qty         : Decimal default 0;
    flxfld4_overage_shortage_qty  : Decimal;
    flxfld4_item_po_qty           : Decimal;
    flxfld4_item_fcst_qty         : Decimal;
    flxfld5_inventory_qty         : Decimal;
    flxfld5_receiving_exp_qty     : Decimal;
    flxfld5_gross_req_qty         : Decimal default 0;
    flxfld5_overage_shortage_qty  : Decimal;
    flxfld5_item_po_qty           : Decimal;
    flxfld5_item_fcst_qty         : Decimal;
    flxfld6_inventory_qty         : Decimal;
    flxfld6_receiving_exp_qty     : Decimal;
    flxfld6_gross_req_qty         : Decimal default 0;
    flxfld6_overage_shortage_qty  : Decimal;
    flxfld6_item_po_qty           : Decimal;
    flxfld6_item_fcst_qty         : Decimal;
    flxfld7_inventory_qty         : Decimal;
    flxfld7_receiving_exp_qty     : Decimal;
    flxfld7_gross_req_qty         : Decimal default 0;
    flxfld7_overage_shortage_qty  : Decimal;
    flxfld7_item_po_qty           : Decimal;
    flxfld7_item_fcst_qty         : Decimal;
    flxfld8_inventory_qty         : Decimal;
    flxfld8_receiving_exp_qty     : Decimal;
    flxfld8_gross_req_qty         : Decimal default 0;
    flxfld8_overage_shortage_qty  : Decimal;
    flxfld8_item_po_qty           : Decimal;
    flxfld8_item_fcst_qty         : Decimal;
    flxfld9_inventory_qty         : Decimal;
    flxfld9_receiving_exp_qty     : Decimal;
    flxfld9_gross_req_qty         : Decimal default 0;
    flxfld9_overage_shortage_qty  : Decimal;
    flxfld9_item_po_qty           : Decimal;
    flxfld9_item_fcst_qty         : Decimal;
    flxfld10_inventory_qty        : Decimal;
    flxfld10_receiving_exp_qty    : Decimal;
    flxfld10_gross_req_qty        : Decimal default 0;
    flxfld10_overage_shortage_qty : Decimal;
    flxfld10_item_po_qty          : Decimal;
    flxfld10_item_fcst_qty        : Decimal;
    flxfld11_inventory_qty        : Decimal;
    flxfld11_receiving_exp_qty    : Decimal;
    flxfld11_gross_req_qty        : Decimal default 0;
    flxfld11_overage_shortage_qty : Decimal;
    flxfld11_item_po_qty          : Decimal;
    flxfld11_item_fcst_qty        : Decimal;
    flxfld12_inventory_qty        : Decimal;
    flxfld12_receiving_exp_qty    : Decimal;
    flxfld12_gross_req_qty        : Decimal default 0;
    flxfld12_overage_shortage_qty : Decimal;
    flxfld12_item_po_qty          : Decimal;
    flxfld12_item_fcst_qty        : Decimal;
    total_record_count            : Decimal;
    rec_seq                       : Decimal;
    creation_date                 : Date;
    interface_type                : String(1);
    attribute_01                  : String(500);
    attribute_02                  : String(150);
    attribute_03                  : String(150);
    attribute_04                  : String(150);
    attribute_05                  : String(150);
    attribute_06                  : String(150);
    attribute_07                  : String(150);
    attribute_08                  : String(150);
    attribute_09                  : String(1000);
    attribute_10                  : String(150);
    attribute_11                  : String(150);
    attribute_12                  : String(1000);
    attribute_13                  : String(150);
    attribute_14                  : String(150);
    attribute_15                  : String(150);
    transfer_date                 : Date;
    process_flag                  : String(1);
    source_type_code              : String(30);	
    flxfld1_eta_qty               : Decimal;
    flxfld2_eta_qty               : Decimal;
    flxfld3_eta_qty               : Decimal;
    flxfld4_eta_qty               : Decimal;
    flxfld5_eta_qty               : Decimal;
    flxfld6_eta_qty               : Decimal;
    flxfld7_eta_qty               : Decimal;
    flxfld8_eta_qty               : Decimal;
    flxfld9_eta_qty               : Decimal;
    flxfld10_eta_qty              : Decimal;
    flxfld11_eta_qty              : Decimal;
    flxfld12_eta_qty              : Decimal;
}
extend Vi_Mrp_R_If with util.Managed;
