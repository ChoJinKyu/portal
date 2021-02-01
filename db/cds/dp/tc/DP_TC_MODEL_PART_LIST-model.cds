namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';

entity Tc_Model_Part_List{
    key tenant_id              : String(5) not null  @title : '테넌트ID';
    key plant_code             : String(10) not null @title : '플랜트코드';
    key model_code             : String(40) not null @title : '모델코드';
    key material_code          : String(40) not null @title : '자재코드';
        uom_code               : String(3)           @title : 'UOM코드';
        material_reqm_quantity : Decimal             @title : '자재소요수량';
        commodity_code         : String(100)         @title : '커머디티코드';
        buyer_empno            : String(30)          @title : '구매담당자사번';
        supplier_code          : String(10)          @title : '공급업체코드';
}

extend Tc_Model_Part_List with util.Managed;
