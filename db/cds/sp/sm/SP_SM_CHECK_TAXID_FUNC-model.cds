namespace sp;

@cds.persistence.exists

entity Sm_Check_Taxid_Func (tenant_id: String(5), tax_id: String(30)){
    key tenant_id                     : String(5)  @title : '테넌트ID';
    key tax_id                        : String(30) @title : '사업자등록번호';
        business_partner_code         : String(10) @title : '비즈니스파트너코드';
        business_partner_local_name   : String(240)@title : '비즈니스파트너코드로컬명';
        business_partner_english_name : String(240)@title : '비즈니스파트너코드영문명';
        supplier_role                 : String(1)  @title : '공급업체역할여부';
        maker_role                    : String(1)  @title : '제조사역할여부';
        message                       : String(500)@title : '메세지';
}
