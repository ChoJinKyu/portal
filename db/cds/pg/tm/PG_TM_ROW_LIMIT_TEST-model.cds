namespace pg;

@cds.persistence.exists

entity Tm_Row_Limit_Test {
    key row_count                : Integer;
        tenant_id                : String(5);
        company_code             : String(10);
        org_type_code            : String(30);
        org_code                 : String(10);
        po_number                : String(50);
        po_item_number           : String(10);
        material_document_number : String(50);
        material_document_year   : String(4);
        material_document_item   : String(10);
}
