namespace pg;

@cds.persistence.exists

entity Monitor_Operation_Mode_View {
    key Operation : String(10)@title : '운영방식';
}
