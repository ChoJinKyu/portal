namespace sp;

using util from '../../cm/util/util-model';
using {sp as negoItemPrices} from '../../sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
// using {sp as nogoSuppliers} from '../../sp/sc/SP_SC_NEGO_SUPPLIERS-model';

entity Sc_Nego_Suppliers {
    key tenant_id                        : String(5) not null  @title : '테넌트ID';
    key nego_header_id                   : Integer64 not null  @title : '협상헤더ID';
    key nego_item_number                 : String(10) not null @title : '협상품목번호';
    key item_supplier_sequence           : String(10) not null @title : '품목공급업체순번';
        Item                             : Association to negoItemPrices.Sc_Nego_Item_Prices
                                               on  Item.tenant_id        = $self.tenant_id
                                               and Item.nego_header_id   = $self.nego_header_id
                                               and Item.nego_item_number = $self.nego_item_number;
        operation_org_code               : String(30)          @title : '운영조직코드';
        operation_unit_code              : String(30)          @title : '운영단위코드';
        nego_supplier_register_type_code : String(10)          @title : '협상공급업체등록유형코드';
        evaluation_type_code             : String(10)          @title : '_평가유형코드-폐기예정';
        nego_supeval_type_code           : String(10)          @title : '협상공급업체평가유형코드';
        supplier_code                    : String(10)          @title : '공급업체코드';
        supplier_name                    : String(300)         @title : '공급업체명';
        //    supplier_group_code : String(30)   @title: '공급업체그룹코드' ;
        supplier_type_code               : String(30)          @title : '공급업체유형코드';
        excl_flag                        : String(1)           @title : '제외여부';
        excl_reason_desc                 : String(1000)        @title : '제외사유설명';
        include_flag                     : String(1)           @title : '포함여부';
        nego_target_include_reason_desc  : String(1000)        @title : '협상대상포함사유설명';
        only_maker_flat                  : String(1)           @title : 'Only Maker Flag';
        contact                          : String(30)          @title : 'Contact';
        //    special_flag : String(1)   @title: '특별여부' ;
        //    confirm_date : Date   @title: '확인일자' ;
        //    confirm_user_id : String(40)   @title: '확인사용자ID' ;
        //    primary_pass_flag : String(1)   @title: '1차통과여부' ;
        //    participation_type_code : String(10)   @title: '참여유형코드' ;
        //    reply_date : Date   @title: '회신일자' ;
        note_content                     : LargeBinary         @title : '노트내용';
//    file_group_number : String(100)   @title: '파일그룹번호' ;
//    s_c_s_user_id : String(50)   @title: 'SCS사용자ID' ;
//    penalty_flag : String(1)   @title: '벌금여부' ;
//    penalty_reason_comment : String(1000)   @title: '벌금사유주석' ;

// include structure util.Managed
// local_create_dtm                : Date                @title : '로컬등록시간';
//    local_update_dtm : Date   @title: '로컬수정시간' ;
//    create_user_id : String(255)   @title: '등록사용자ID' ;
//    update_user_id : String(255)   @title: '변경사용자ID' ;
//    system_create_dtm : Date(40)   @title: '시스템등록시간' ;
//    system_update_dtm : Date(40)   @title: '시스템수정시간' ;
}

extend Sc_Nego_Suppliers with util.Managed;
