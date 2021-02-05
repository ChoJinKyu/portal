namespace sp;

/////////////////////////////////// Reference Model ///////////////////////////////////
/* Transaction Association */
using util from '../../cm/util/util-model';
using {sp.Sc_Nego_Headers} from '../../sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Item_Non_Price_Dtl} from '../../sp/sc/SP_SC_NEGO_ITEM_NON_PRICE_DTL-model';

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
// using {sp.Sc_Nego_Item_Non_Price} from '../../sp/sc/SP_SC_NEGO_ITEM_NON_PRICE-model';
/////////////////////////////////// Main Logic Summary ///////////////////////////////////

/////////////////////////////////// Main Logic ///////////////////////////////////
entity Sc_Nego_Item_Non_Price {
    key tenant_id                      : String(5) not null  @title : '테넌트ID';
    key nego_header_id                 : Integer64 not null  @title : '협상헤더ID';
    key nonpr_item_number              : Integer not null    @title : '비가격품목번호';
        ItemsNonPriceDtl               : Composition of many Sc_Nego_Item_Non_Price_Dtl
                                             on ItemsNonPriceDtl.tenant_id = $self.tenant_id
                                             and ItemsNonPriceDtl.nego_header_id = $self.nego_header_id
                                             and ItemsNonPriceDtl.nonpr_item_number = $self.nonpr_item_number;
        Header                         : Association to Sc_Nego_Headers
                                             on Header.tenant_id = $self.tenant_id
                                             and Header.nego_header_id = $self.nego_header_id;

        nonpr_score_comput_method_code : String(30)          @title : '비가격점수산정방법코드'  @description   : 'UI:점수 산정 방법';
        nonpr_supeval_attr_type_code   : String(30)          @title : '비가격평가항목유형코드'  @description   : 'UI:평가항목 유형';
        nonpr_supeval_attr_val_type_cd : String(10)          @title : '비가격평가속성값유형코드'  @description  : 'UI:평가 속성';
        nonpr_requirements_text        : String(1000)        @title : '비가격요구사항텍스트'  @description    : 'UI:요구사항';
        note_content                   : LargeBinary         @title : '비고'  @description            : 'UI:비고';
        target_score                   : Decimal(28, 3)      @title : '목표점수'  @description          : 'UI:Target Score';
        file_group_code                : String(30)          @title : '파일그룹코드'  @description        : 'UI:첨부파일목록코드';

// include structure util.Managed
//    local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;
}

extend Sc_Nego_Item_Non_Price with util.Managed;
