namespace sp;	
 
@cds.persistence.exists
entity Se_Eval_Sheet_Eval_Item_Export_Tree_View {
    parent_id                             : String               @title: '부모노드아이디';
    node_id                               : String               @title: '노드아이디';
    key tenant_id                         : String(5)   not null @title: '테넌트ID';
    key company_code                      : String(10)  not null @title: '회사코드';
    key org_type_code                     : String(2)   not null @title: '운영조직유형코드';
    key org_code                          : String(10)  not null @title: '운영조직코드';
    key evaluation_operation_unit_code    : String(30)  not null @title: '운영단위코드';    
    key evaluation_type_code              : String(30)  not null @title: '평가유형코드';
    key regular_evaluation_id             : String(100) not null @title: '정기평가ID';
    evaluation_article_code               : String(30)  not null @title: '평가항목코드';
    evaluation_article_name               : String(240) not null @title: '평가항목명';
    parent_evaluation_article_code        : String(30)           @title: '상위평가항목';
    evaluation_distrb_score_weight        : Decimal(5,2)         @title: '평가배점가중치' ;
    evaluation_execute_mode_code          : String(30)           @title: '평가수행방식코드';
    evaluation_article_type_code          : String(30)           @title: '평가항목구분코드';    
    evaluation_distrb_scr_type_cd         : String(30)           @title: '평가배분점수유형코드';    
    evaluation_result_input_type_cd       : String(30)           @title: 'Scale유형코드';
    evaluation_article_desc               : String(3000)         @title: '평가항목설명';    
    qttive_item_uom_code                  : String(30)           @title: '정량항목측정단위코드';
    qttive_eval_article_calc_formula      : String(1000)         @title: '정량평가항목계산공식';
    evaluation_article_lvl_attr_cd        : String(30)           @title: '평가항목레벨속성코드';
    sort_sequence                         : Decimal              @title: '정렬순서';
    evaluation_article_path_sequence      : String(100)          @title: '평가항목풀경로순번';
    evaluation_article_path_code          : String(100)          @title: '평가항목풀경로코드';
    evaluation_article_path_name          : String(500)          @title: '평가항목풀경로명'; 
    higher_level_path_name                : String               @title: '상위경로명';
    evaluation_article_display_name       : String(240)          @title: '평가항목풀조회명';
    evaluation_article_level1_code        : String(20)           @title: '평가항목풀레벨1코드';
    evaluation_article_level2_code        : String(20)           @title: '평가항목풀레벨2코드';
    evaluation_article_level3_code        : String(20)           @title: '평가항목풀레벨3코드';
    evaluation_article_level4_code        : String(20)           @title: '평가항목풀레벨4코드';
    evaluation_article_level5_code        : String(20)           @title: '평가항목풀레벨5코드';
    evaluation_article_level1_name        : String(240)          @title: '평가항목풀레벨1명';
    evaluation_article_level2_name        : String(240)          @title: '평가항목풀레벨2명';
    evaluation_article_level3_name        : String(240)          @title: '평가항목풀레벨3명';
    evaluation_article_level4_name        : String(240)          @title: '평가항목풀레벨4명';
    evaluation_article_level5_name        : String(240)          @title: '평가항목풀레벨5명';
    hierarchy_rank                        : Integer64;
    hierarchy_tree_size                   : Integer64;
    hierarchy_parent_rank                 : Integer64;
    hierarchy_level                       : Integer;
    hierarchy_root_rank                   : Integer64;
    hierarchy_is_cycle                    : Boolean;
    hierarchy_is_orphan                   : Boolean;
}