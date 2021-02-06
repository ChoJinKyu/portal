namespace dp;

using util from '../../cm/util/util-model';
// using {dp.VI_Base_Price_Arl_Mst as master} from './DP_VI_BASE_PRICE_ARL_MST-model';
// using {dp.VI_Base_Price_Arl_Price as price} from './DP_VI_BASE_PRICE_ARL_PRICE-model';
// using {cm.Code_Dtl as code} from '../../cm/CM_CODE_DTL-model';
// using {cm.Org_Tenant as tenant} from '../../cm/CM_ORG_TENANT-model';
// using {cm.Org_Company as comp} from '../../cm/CM_ORG_COMPANY-model';
// using {cm.Pur_Operation_Org as org} from '../../cm/CM_PUR_OPERATION_ORG-model';
// using {dp.Mm_Material_Mst as material} from '../mm/DP_MM_MATERIAL_MST-model';
// using {sp.Sm_Supplier_Mst as supplier} from '../../sp/sm/SP_SM_SUPPLIER_MST-model';

entity VI_Base_Price_Arl_Dtl {
    key tenant_id                   : String(5) not null;
    key approval_number             : String(30) not null;
    key item_sequence               : Decimal not null;
        company_code                : String(10) not null;
        org_type_code               : String(2) not null;
        org_code                    : String(10) not null;
        material_code               : String(40) not null;
        base_uom_code               : String(3);
        supplier_code               : String(10);
        base_date                   : Date not null;
        base_price_ground_code      : String(30) not null;
        change_reason_code          : String(30);
        repr_material_code          : String(40);
        repr_material_supplier_code : String(10);
        repr_material_org_code      : String(10);

// prices                    : Composition of many price
//                                 on  prices.tenant_id       = tenant_id
//                                 and prices.approval_number = approval_number
//                                 and prices.item_sequence   = item_sequence;

// approval_number_fk        : Association to master
//                                 on  approval_number_fk.tenant_id       = tenant_id
//                                 and approval_number_fk.approval_number = approval_number;
// tenant_id_fk              : Association to tenant
//                                 on tenant_id_fk.tenant_id = tenant_id;
// company_code_fk           : Association to comp
//                                 on  company_code_fk.tenant_id    = tenant_id
//                                 and company_code_fk.company_code = company_code;
// org_code_fk               : Association to org
//                                 on  org_code_fk.tenant_id    = tenant_id
//                                 and org_code_fk.company_code = company_code
//                                 and org_code_fk.org_type_code = 'PL'
//                                 and org_code_fk.org_code = org_code;
// material_code_fk          : Association to material
//                                 on material_code_fk.tenant_id = tenant_id
//                                 and material_code_fk.material_code = material_code;
// supplier_code_fk          : Association to supplier
//                                 on  supplier_code_fk.tenant_id     = tenant_id
//                                 and supplier_code_fk.supplier_code = supplier_code;
// base_price_ground_code_fk : Association to code
//                                 on  base_price_ground_code_fk.tenant_id  = tenant_id
//                                 and base_price_ground_code_fk.group_code = 'DP_VI_BASE_PRICE_GROUND_CODE'
//                                 and base_price_ground_code_fk.code       = base_price_ground_code;
};

extend VI_Base_Price_Arl_Dtl with util.Managed;
annotate VI_Base_Price_Arl_Dtl with @title : '품의 상세'  @description : '개발단가 품의 상세';

annotate VI_Base_Price_Arl_Dtl with {
    tenant_id                   @title : '테넌트ID'  @description    : '테넌트ID';
    approval_number             @title : '품의번호'  @description     : '품의번호';
    item_sequence               @title : '품목순번'  @description     : '품목순번';
    company_code                @title : '회사코드'  @description     : '회사코드';
    org_type_code               @title : '조직유형코드'  @description   : '조직유형코드';
    org_code                    @title : '조직코드'  @description     : '조직코드';
    material_code               @title : '자재코드'  @description     : '자재코드';
    base_uom_code               @title : '기본측정단위코드'  @description : 'material entity 참조';
    supplier_code               @title : '공급업체코드'  @description   : '공급업체코드';
    base_date                   @title : '기준일자'  @description     : '기준일자';
    base_price_ground_code      @title : '기준단가근거코드'  @description : '공통코드(CM_CODE_DTL, DP_VI_BASE_PRICE_GROUND_CODE) : COST(Cost Table), RFQ(RFQ), FMC(Family Material Code)';
    change_reason_code          @title : '변경사유코드'  @description   : '공통코드(CM_CODE_DTL, DP_VI_CHANGE_REASON_CODE)';
    repr_material_code          @title : '대표자재코드'  @description   : '대표자재코드';
    repr_material_supplier_code @title : '변경사유코드'  @description   : '대표자재공급업체코드';
    repr_material_org_code      @title : '변경사유코드'  @description   : '대표자재조직코드';
};
