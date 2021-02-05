namespace sp;

/////////////////////////////////// Reference Model ///////////////////////////////////
/* Transaction Association */
using util from '../../cm/util/util-model';
using {sp.Sc_Nego_Headers} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Item_Non_Price} from '../../sp/sc/SP_SC_NEGO_ITEM_NON_PRICE-model';

/* Master Association */
/**
 * 타스크럼 재정의[Redefined, Restricted, Materialized 등]
 */
// using {
//     sp.Sc_Employee_View,
//     sp.Sc_Hr_Department,
//     sp.Sc_Pur_Operation_Org,
//     sp.Sc_Pu_Pr_Mst,
//     sp.Sc_Approval_Mst
// } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';

// using { sp.Sc_Mm_Material_Mst } from '../../sp/sc/SP_SC_REFERENCE_OTHERS.model';

// using {
//     sp.Sc_Incoterms_View,
//     sp.Sc_Payment_Terms_View,
//     sp.Sc_Market_Code_View,
//     sp.Sc_Spec_Code_View
// } from '../../sp/sc/SP_SC_REFERENCE_COMMON.model';

/////////////////////////////////// Reference Type ///////////////////////////////////
// TYPE-POOLS
using {
    sp.CurrencyT,
    sp.AmountT,
    sp.PriceAmountT,
    sp.UnitT,
    sp.QuantityT
} from '../../sp/sc/SP_SC_NEGO_0TYPE_POOLS-model';

/////////////////////////////////// How to use ///////////////////////////////////
// using {sp.Sc_Nego_Item_Non_Price_Dtl} from '../../sp/sc/SP_SC_NEGO_ITEM_NON_PRICE_DTL-model';
/////////////////////////////////// Main Logic Summary ///////////////////////////////////

/////////////////////////////////// Main Logic ///////////////////////////////////
entity Sc_Nego_Item_Non_Price_Dtl {
    key tenant_id               : String(5) not null  @title : '테넌트ID';
    key nego_header_id          : Integer64 not null  @title : '협상헤더ID';
    key nonpr_item_number              : Integer not null    @title : '비가격품목번호';
    key nonpr_dtl_item_number   : Integer not null    @title : '비가격상세품목번호';
        ItemsNonPrice           : Association to Sc_Nego_Item_Non_Price
                                      on ItemsNonPrice.tenant_id = $self.tenant_id
                                      and ItemsNonPrice.nego_header_id = $self.nego_header_id
                                      and ItemsNonPrice.nonpr_item_number = $self.nonpr_item_number;

        supeval_from_date       : Date                @title : '평가시작일자' @description : 'UI:Response Value From';
        supeval_to_date         : Date                @title : '평가종료일자' @description : 'UI:Response Value To';
        supeval_from_value      : Decimal(28, 3)      @title : '평가범위시작값' @description : 'UI:Response Value From(>)';
        supeval_to_value        : Decimal(28, 3)      @title : '평가범위종료값' @description : 'UI:Response Value To(<=)';
        supeval_text_value      : String(100)         @title : '평가단일값' @description : 'UI:Response Value';
        supeval_score           : Decimal(28, 3)      @title : '평가점수' @description : 'UI:점수';

// include structure util.Managed
//    local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;
}

extend Sc_Nego_Item_Non_Price_Dtl with util.Managed;
