namespace sp;

using util from '../../cm/util/util-model';
// using {sp as nogoSuppliers} from '../../sp/sc/SP_SC_NEGO_SUPPLIERS-model';

entity Sc_Nego_Suppliers {
    key tenant_id                       : String(5) not null  @title : '테넌트ID';
    key nego_header_id                  : Integer64 not null  @title : '협상헤더ID';
    key nego_item_number                : String(10) not null @title : '협상품목번호';
    key item_supplier_sequence          : String(10) not null @title : '품목공급업체순번';
        operation_org_a_id              : String(30) not null @title : '운영조직AID';
        operation_unit_code             : String(30) not null @title : '운영단위코드';
        vendor_site_code                : String(15)          @title : '협력사지점코드';
        vendor_site_id                  : String(30)          @title : '협력사지점코드';
        supplier_name                   : String(300)         @title : '공급업체명';
        supplier_group_code             : String(30)          @title : '공급업체그룹코드';
        supplier_type_code              : String(30)          @title : '공급업체유형코드';
        excl_flag                       : String(1)           @title : '제외여부';
        excl_reason_desc                : String(1000)        @title : '제외사유설명';
        include_flag                    : String(1)           @title : '포함여부';
        nego_target_include_reason_desc : String(1000)        @title : '협상대상포함사유설명';
        special_flag                    : String(1)           @title : '특별여부';
        confirm_date                    : Date                @title : '확인일자';
        confirm_user_id                 : String(40)          @title : '확인사용자ID';
        primary_pass_flag               : String(1)           @title : '1차통과여부';
        participation_type_code         : String(10)          @title : '참여유형코드';
        reply_date                      : Date                @title : '회신일자';
        note_content                    : String(4000)        @title : '노트내용';
        file_group_number               : String(100)         @title : '파일그룹번호';
        s_c_s_user_id                   : String(50)          @title : 'SCS사용자ID';
        penalty_flag                    : String(1)           @title : '벌금여부';
        penalty_reason_comment          : String(1000)        @title : '벌금사유주석';
}

extend Sc_Nego_Suppliers with util.Managed;
