using {xx as Table} from '../../../db/cds/xx/testTable/XX_TESTTABLE-model';
using {xx as Tree} from '../../../db/cds/xx/testTable/XX_TREE-model';

namespace xx;

@path : '/xx.TestTableService'
service TestTableService {
  entity TestTable      as projection on Table.Test_Table;
  entity Products       as projection on Tree.Products;
  entity Categories     as projection on Tree.Categories;
  entity Categories_h   as projection on Tree.Categories_h;
  entity Categories_haa as projection on Tree.Categories_haa;
}
