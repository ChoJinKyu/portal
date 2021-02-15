using { sp.Se_Eval_Sheet_Eval_Item_Export_Tree_View as exportSheetTreeView} from '../../../../../db/cds/sp/se/SP_SE_EVAL_SHEET_EVAL_ITEM_EXPORT_TREE_VIEW-model';
using { sp.Se_Regular_Eval_Sum as evalSum} from '../../../../../db/cds/sp/se/SP_SE_REGULAR_EVAL_SUM-model';
using { sp.Se_Eval_Sheet_Eval_Item_Opt_view as sheetItemOpt} from '../../../../../db/cds/sp/se/SP_SE_EVAL_SHEET_EVAL_ITEM_OPT_VIEW-model';
using { cm.Code_View as codeView } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';

namespace sp;
@path : '/sp.evaluationSheetItemMngtService'
service EvaluationSheetItemMngtService {

    /*가중치 콤보 */
    entity EvalDistrbScoreWeightCombo as projection on exportSheetTreeView;
    
    
    /* Eval Sheet Item List View */
    view  EvalSheetItemListView as
    SELECT esei.parent_id
          ,esei.node_id
          ,key esei.tenant_id                      /*테넌트ID*/
          ,key esei.company_code                   /*회사코드*/
          ,key esei.org_type_code                  /*조직유형코드*/
          ,key esei.org_code                       /*조직코드*/
          ,key esei.evaluation_operation_unit_code /*평가운영단위코드*/
          ,esei.evaluation_type_code           /*평가유형코드*/
          ,key res.regular_evaluation_id           /*정기평가ID*/
          ,res.regular_evaluation_year         /*정기평가년도*/
          ,res.regular_evaluation_period_code  /*정기평가기간코드*/
          ,res.regular_evaluation_name         /*정기평가명*/
          ,res.regular_eval_prog_status_cd     /*정기평가진행상태코드*/
          ,res.actual_aggregate_start_date     /*실적집계시작일자*/	
          ,res.actual_aggregate_end_date       /*실적집계종료일자*/
          ,key esei.evaluation_article_code        /*평가항목코드*/
          ,esei.evaluation_article_name         /*평가항목명*/
          ,esei.parent_evaluation_article_code  /*상위평가항목코드*/
          ,esei.evaluation_distrb_score_weight /*평가배점가중치*/
          ,esei.evaluation_execute_mode_code   /*평가실행방식코드*/
          ,cv_art.code_name  AS evaluation_execute_mode_name : String(300) /*평가수행방식코드명*/
          ,esei.evaluation_article_type_code   /*평가항목구분코드*/
          ,cv_art2.code_name AS evaluation_article_type_name : String(300) /*평가항목구분코드명*/
          ,esei.evaluation_distrb_scr_type_cd  /*평가배점유형코드*/
          ,cv_scr.code_name AS evaluation_distrb_scr_type_name : String(300)     /*평가배분점수유형코드명*/          
          ,esei.evaluation_article_desc        /*평가항목설명*/
          /*Scale Start*/
          ,scle.scle_display_text1  : String(100)
          ,scle.opt_range_value1    : Decimal
          ,scle.scle_display_text2  : String(100)
          ,scle.opt_range_value2    : Decimal
          ,scle.scle_display_text3  : String(100)
          ,scle.opt_range_value3    : Decimal
          ,scle.scle_display_text4  : String(100)
          ,scle.opt_range_value4    : Decimal
          ,scle.scle_display_text5  : String(100)
          ,scle.opt_range_value5    : Decimal
          ,scle.scle_display_text6  : String(100)
          ,scle.opt_range_value6    : Decimal
          ,scle.scle_display_text7  : String(100)
          ,scle.opt_range_value7    : Decimal
          ,scle.scle_display_text8  : String(100)
          ,scle.opt_range_value8    : Decimal
          ,scle.scle_display_text9  : String(100)
          ,scle.opt_range_value9    : Decimal
          ,scle.scle_display_text10 : String(100)
          ,scle.opt_range_value10   : Decimal
          /*Scale End*/
          ,esei.evaluation_article_path_sequence
          ,esei.evaluation_article_path_code
          ,esei.evaluation_article_path_name
          ,esei.higher_level_path_name
          ,esei.evaluation_article_display_name
          ,esei.evaluation_article_level1_code
          ,esei.evaluation_article_level2_code
          ,esei.evaluation_article_level3_code
          ,esei.evaluation_article_level4_code
          ,esei.evaluation_article_level5_code
          ,esei.evaluation_article_level1_name
          ,esei.evaluation_article_level2_name
          ,esei.evaluation_article_level3_name
          ,esei.evaluation_article_level4_name
          ,esei.evaluation_article_level5_name
          ,esei.hierarchy_rank            /*현재node의 순번(sibling order by에 의한)*/
          ,esei.hierarchy_tree_size       /*현재node포함 하위node 갯수(1이면 leaf node(마지막node))*/
          ,esei.hierarchy_parent_rank     /*부모node의 순번*/
          ,esei.hierarchy_level           /*현재node의 Level*/
          ,esei.hierarchy_root_rank       /*root node의 순번*/
          ,esei.hierarchy_is_cycle        /*순환구조여부(0:False, 1:True)*/
          ,esei.hierarchy_is_orphan       /*전개후 연결이 끊어진 노드여부(0:False, 1:True)*/
          ,CASE WHEN esei.hierarchy_tree_size = 1 THEN 'leaf' ELSE 'expanded' END AS drill_state : String(10)
          ,CASE WHEN esei.evaluation_article_lvl_attr_cd = 'ITEM' AND esei.hierarchy_tree_size = 1 THEN 'Y' ELSE 'N' END AS leaf_flag : String(1)
    FROM   evalSum     res
           INNER JOIN exportSheetTreeView esei
           ON     res.regular_evaluation_id = esei.regular_evaluation_id
           LEFT OUTER JOIN  sheetItemOpt scle
           ON     esei.tenant_id            = scle.tenant_id
           AND    esei.company_code         = scle.company_code
           AND    esei.org_type_code        = scle.org_type_code
           AND    esei.org_code             = scle.org_code
           AND    esei.evaluation_operation_unit_code = scle.evaluation_operation_unit_code
           AND    esei.evaluation_type_code = scle.evaluation_type_code
           AND    esei.evaluation_article_code = scle.evaluation_article_code
           LEFT OUTER JOIN codeView cv_art
           ON   cv_art.tenant_id  = esei.tenant_id
           AND  cv_art.group_code = 'SP_SE_EVAL_ARTICLE_TYPE_CODE'
           AND  cv_art.code       = esei.evaluation_execute_mode_code
           AND  cv_art.language_cd = 'KO'
           LEFT OUTER JOIN codeView cv_art2
           ON   cv_art2.tenant_id  = esei.tenant_id
           AND  cv_art2.group_code = 'SP_SE_EVAL_ARTICLE_TYPE_CODE'
           AND  cv_art2.code       = esei.evaluation_article_type_code
           AND  cv_art2.language_cd = 'KO'
           LEFT OUTER JOIN codeView cv_scr
           ON   cv_scr.tenant_id  = esei.tenant_id
           AND  cv_scr.group_code = 'SP_SE_EVAL_DISTRB_SCR_TYPE_CD'
           AND  cv_scr.code       = esei.evaluation_distrb_scr_type_cd
           AND  cv_scr.language_cd = 'KO'
           ;   
    

}