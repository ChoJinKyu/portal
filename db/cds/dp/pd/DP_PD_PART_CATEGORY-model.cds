namespace dp;	
using util from '../../cm/util/util-model';
using {dp as partCategoryLng} from '../pd/DP_PD_PART_CATEGORY_LNG-model';
// using {dp as partCategory} from '../pd/DP_PD_PART_CATEGORY-model';	
	
entity Pd_Part_Category {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key category_group_code : String(30)  not null @title: '카테고리 그룹 코드' ;	
  key category_code : String(40)  not null @title: '카테고리 코드' ;	

          children    : Composition of many partCategoryLng.Pd_Part_Category_Lng
                          on  children.tenant_id  = tenant_id
                          and children.category_group_code = category_group_code
                          and children.category_code = category_code;

    parent_category_code : String(40)   @title: '상위 카테고리 코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Part_Category with util.Managed;	

@cds.persistence.exists
entity Pd_Part_Category_View {
    key node_id               : String;
    key parent_id             : String;
    key tenant_id             : String;
        category_group_code   : String;
        category_code         : String;
        category_group_name   : String;
        category_name         : String;
        parent_category_code  : String;
        sequence              : Decimal;
        active_flag           : Boolean;
        update_user_id        : String;
        local_update_dtm      : DateTime;
        path                  : String;
        hierarchy_rank        : Integer;
        hierarchy_tree_size   : Integer;
        hierarchy_parent_rank : Integer;
        hierarchy_root_rank   : Integer;
        hierarchy_level       : Integer;
        drill_state           : String;
};

@cds.persistence.exists
entity Pd_Part_Parent_Category_View {
    key node_id               : String;
    key parent_id             : String;
    key tenant_id             : String;
    key category_group_code   : String;
    key category_code         : String;
        category_name         : String;
        parent_category_code  : String;
        sequence              : Decimal;
        path                  : String;
        hierarchy_rank        : Integer;
        hierarchy_tree_size   : Integer;
        hierarchy_parent_rank : Integer;
        hierarchy_root_rank   : Integer;
        hierarchy_level       : Integer;
};