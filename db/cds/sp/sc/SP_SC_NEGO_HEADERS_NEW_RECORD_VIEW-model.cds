namespace sp;

@cds.persistence.exists
entity Sc_Nego_Headers_New_Record_View {
    key tenant_id                      : String(5) not null @title : '테넌트ID';
    key nego_header_id                 : Integer64 not null @title : '협상헤더ID';
        reference_nego_header_id       : Integer64          @title : '참조협상헤더ID';
        previous_nego_header_id        : Integer64          @title : '이전협상헤더ID';
        reference_nego_document_number : Integer            @title : '참조협상문서번호';
        nego_document_round            : Integer            @title : '협상문서회차';
        nego_document_number           : String(50)         @title : '협상문서번호';

}
