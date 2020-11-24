using {pg as MIMatPrcMngtPtyp} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_PRICE_MANAGEMENT_PTYPE';

namespace pg;

@path : '/pg.miProceduerService'
service miProceduerService {
    @readonly
    entity MIMaterialPriceManagementPtype @(title : '시황자재 가격관리 테이블타입') as projection on MIMatPrcMngtPtyp.MI_Mat_Prc_Management_Ptype;

    action MiMaterialPriceManagement(value : array of MIMaterialPriceManagementPtype) returns String;
}
