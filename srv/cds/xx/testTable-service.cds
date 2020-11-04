using {xx as Table} from '../../../db/cds/xx/testTable/XX_TESTTABLE-model';

namespace xx;
@path : '/xx.TestTableService'
service TestTableService {
    entity TestTable as projection on Table.Test_Table;
}