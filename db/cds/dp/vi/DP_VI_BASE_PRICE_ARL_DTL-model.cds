namespace dp;

using util from '../../cm/util/util-model';
using {dp.VI_Base_Price_Arl_Mst as master} from './DP_VI_BASE_PRICE_ARL_MST-model';
using {dp.VI_Base_Price_Arl_Price as price} from './DP_VI_BASE_PRICE_ARL_PRICE-model';
using {cm.Org_Tenant as tenant} from '../../cm/orgMgr/CM_ORG_TENANT-model';
using {sp.Sm_Supplier_Mst as supplier} from '../../sp/supplierMgr/SP_SM_SUPPLIER_MST-model';

entity VI_Base_Price_Arl_Dtl {
    key tenant_id          : String(5) not null;
    key approval_number    : String(50) not null;
    key item_sequence      : Decimal not null;
        au_code            : String(10) not null;
        material_code      : String(40) not null;
        supplier_code      : String(10);
        base_date          : Date not null;

        prices             : Composition of many price
                                 on  prices.tenant_id       = tenant_id
                                 and prices.approval_number = approval_number
                                 and prices.item_sequence   = item_sequence;

        approval_number_fk : Association to master
                                 on  approval_number_fk.tenant_id       = tenant_id
                                 and approval_number_fk.approval_number = approval_number;
        tenant_id_fk       : Association to tenant
                                 on tenant_id_fk.tenant_id = tenant_id;
        supplier_code_fk   : Association to supplier
                                 on  supplier_code_fk.tenant_id     = tenant_id
                                 and supplier_code_fk.supplier_code = supplier_code;
};

extend VI_Base_Price_Arl_Dtl with util.Managed;

annotate VI_Base_Price_Arl_Dtl with @title : '품의 상세'  @description : '개발단가 품의 상세';

annotate VI_Base_Price_Arl_Dtl with {
    tenant_id       @title : '테넌트ID'  @description  : '테넌트ID';
    approval_number @title : '품의번호'  @description   : '품의번호';
    item_sequence   @title : '품목순번'  @description   : '품목순번';
    au_code         @title : '회계단위코드'  @description : '회계단위코드';
    material_code   @title : '자재코드'  @description   : '자재코드';
    supplier_code   @title : '공급업체코드'  @description : '공급업체코드';
    base_date       @title : '기준일자'  @description   : '기준일자';
};
