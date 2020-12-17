namespace pg;

@cds.persistence.exists

entity Tm_Mobile_Phone_Number_View {
    key tenant_id           : String(5) @title : '회사코드';
        mobile_phone_number : String(50)@title : '휴대폰번호';
}
