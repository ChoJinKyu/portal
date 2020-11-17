using { pg as cateId } from '../../../../db/cds/pg/spend_md/PG_MD_CATEGORY_ID-model.cds';
using { pg as cateItem } from '../../../../db/cds/pg/spend_md/PG_MD_CATEGORY_ITEM-model.cds';

namespace pg;

@cds.query.limit.default: 20
@cds.query.limit.max: 100
@path : '/pg.MdCategoryService'
service MdCategoryService {

    entity MdCategory as projection on cateId.Md_Category_Id;

    entity MdCategoryItem as projection on cateId.Md_Category_Item;


}