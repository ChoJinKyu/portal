namespace xx;

using {
  Currency,
  cuid,
  managed,
  sap.common.CodeList
} from '@sap/cds/common';

entity Products : cuid, managed {
  title    : localized String(111);
  descr    : localized String(1111);
  stock    : Integer;
  price    : Decimal(9, 2);
  currency : Currency;
  category : Association to Categories;
}

entity Categories : CodeList {
  key ID       : Integer;
      parent   : Association to Categories;
      children : Composition of many Categories
                   on children.parent = $self;
}

@cds.persistence.exists
entity Categories_h {
  key node_id   : Integer;
      parent_id : Integer;
      name      : String;
      descr     : String;
}

@cds.persistence.exists
entity Categories_haa {
  key node_id   : Integer;
      parent_id : Integer;
      name      : String;
      descr     : String;
      path      : String;
}
