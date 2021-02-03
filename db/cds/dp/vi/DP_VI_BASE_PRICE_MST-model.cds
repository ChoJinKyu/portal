namespace dp;

using util from '../../cm/util/util-model';
using {dp.VI_Base_Price_Arl_Dtl as dtl} from './DP_VI_BASE_PRICE_ARL_DTL-model';
// using {cm.Code_Dtl as code} from '../../cm/CM_CODE_DTL-model';

entity VI_Base_Price_Mst {
    key tenant_id                    : String(5) not null;
    key company_code                 : String(10) not null;
    key org_type_code                : String(2) not null;
    key org_code                     : String(10) not null;
    key material_code                : String(40) not null;
    key supplier_code                : String(10) not null;
    key market_code                  : String(30) not null;
    key base_date                    : Date not null;
        approval_number              : String(30);
        item_sequence                : Decimal;
        base_uom_code                : String(3);
        new_base_price               : Decimal(19, 4);
        new_base_price_currency_code : String(3);
        base_price_ground_code       : String(30) not null;
        base_price_start_date        : Date;
        base_price_end_date          : Date;
        first_purchasing_net_price   : Decimal(19, 4);
        first_pur_netprice_curr_cd   : String(3);
        first_pur_netprice_str_dt    : Date;
        effective_flag               : String(1);
        buyer_empno                  : String(30);
        new_change_type_code         : String(30);
        repr_material_org_code       : String(10);
        repr_material_code           : String(40);
        repr_material_supplier_code  : String(10);
        repr_material_market_code    : String(30);
        erp_interface_flag           : String(1);
        erp_interface_date           : Date;

        item_sequence_fk             : Association to dtl
                                           on item_sequence_fk.tenant_id = tenant_id
                                           and item_sequence_fk.approval_number = approval_number
                                           and item_sequence_fk.item_sequence = item_sequence;

        // base_price_ground_code_fk : Association to code
        //                                 on  base_price_ground_code_fk.tenant_id  = tenant_id
        //                                 and base_price_ground_code_fk.group_code = 'DP_VI_BASE_PRICE_GROUND_CODE'
        //                                 and base_price_ground_code_fk.code       = base_price_ground_code;
};
extend VI_Base_Price_Mst with util.Managed;

annotate VI_Base_Price_Mst with @title : '개발기준단가'  @description : '개발기준단가';

annotate VI_Base_Price_Mst with {
    tenant_id                    @title : '테넌트ID'  @description      : '테넌트ID';
    company_code                 @title : '회사코드'  @description       : '회사코드';
    org_type_code                @title : '조직유형코드'  @description     : '조직유형코드';
    org_code                     @title : '조직코드'  @description       : '조직코드';
    material_code                @title : '자재코드'  @description       : '자재코드';
    supplier_code                @title : '공급업체코드'  @description     : '공급업체코드';
    market_code                  @title : '납선코드'  @description       : '공통코드(CM_CODE_DTL, DP_VI_MARKET_CODE) : 0(Common), 1(Export), 2(Domestic)';
    base_date                    @title : '기준일자'  @description       : '기준일자';
    approval_number              @title : '품의번호'  @description       : '품의번호';
    item_sequence                @title : '품목순번'  @description       : '품목순번';
    base_uom_code                @title : '기본측정단위코드'  @description   : 'material entity 참조';
    new_base_price               @title : '신규기준단가'  @description     : '신규기준단가';
    new_base_price_currency_code @title : '신규기준단가통화코드'  @description : '신규기준단가통화코드';
    base_price_ground_code       @title : '기준단가근거코드'  @description   : '공통코드(CM_CODE_DTL, DP_VI_BASE_PRICE_GROUND_CODE) : COST(Cost Table), RFQ(RFQ), FMC(Family Material Code)';
    base_price_start_date        @title : '기준단가시작일자'  @description   : '기준단가시작일자';
    base_price_end_date          @title : '기준단가종료일자'  @description   : '기준단가종료일자';
    first_purchasing_net_price   @title : '최초구매단가'  @description     : '최초구매단가';
    first_pur_netprice_curr_cd   @title : '최초구매단가통화코드'  @description : '최초구매단가통화코드';
    first_pur_netprice_str_dt    @title : '최초구매시작일자'  @description   : '최초구매시작일자';
    effective_flag               @title : '유효여부'  @description       : '유효여부';
    buyer_empno                  @title : '구매담당자사번'  @description    : '구매담당자사번';
    new_change_type_code         @title : '신규변경구분코드'  @description   : '공통코드(CM_CODE_DTL, DP_NEW_CHANGE_CODE) : 10(NEW), 20(CHANGE)';
    repr_material_org_code       @title : '대표자재조직코드'  @description   : '대표자재조직코드';
    repr_material_code           @title : '대표자재코드'  @description     : '대표자재코드';
    repr_material_supplier_code  @title : '대표자재공급업체코드'  @description : '대표자재공급업체코드';
    repr_material_market_code    @title : '대표자재납선코드'  @description   : '대표자재납선코드';
    erp_interface_flag           @title : 'ERP인터페이스여부'  @description : 'ERP인터페이스여부';
    erp_interface_date           @title : 'ERP인터페이스일자'  @description : 'ERP인터페이스일자';
};
