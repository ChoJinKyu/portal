using {pg as Group1} from '../../../../db/cds/pg/spend/PG_MD_CATEGORY_ID-model';
using {pg as Group2} from '../../../../db/cds/pg/spend/PG_MD_CATEGORY_ITEM-model';

namespace pg;

// VP별 Category 설정
service MdCategory {
    entity Md_Category_Id as projection on Group1.Md_Category_Id;
    entity Md_Category_Item as projection on Group2.Md_Category_Item;
}