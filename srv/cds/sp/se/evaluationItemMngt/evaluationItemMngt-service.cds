using { cm.Pur_Operation_Org as operationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { cm.Code_View as codeView } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
using { sp.Se_Operation_Unit_Manager as opUnitManager } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MANAGER-model';
using { sp.Se_Eval_Type as evalType } from '../../../../../db/cds/sp/se/SP_SE_EVAL_TYPE-model';
using { sp.Se_Operation_Unit_Mst as opUnitMst } from '../../../../../db/cds/sp/se/SP_SE_OPERATION_UNIT_MST-model';
using { sp.Se_Eval_Item_Export_Tree_View as exportTreeView} from '../../../../../db/cds/sp/se/SP_SE_EVAL_ITEM_EXPORT_TREE_VIEW-model';
using { sp.Se_Eval_Item_Opt as evalItemOpt} from '../../../../../db/cds/sp/se/SP_SE_EVAL_ITEM_OPT-model';
using { sp.Se_Quantitative_Item as qttiveItem} from '../../../../../db/cds/sp/se/SP_SE_QUANTITATIVE_ITEM-model';

namespace sp;
@path : '/sp.evaluationItemMngtService'
service EvaluationItemMngtService {

    /* User's Evaluation ORG. (Condition) */
    view UserEvalOrgView as
    SELECT DISTINCT 
           key mng.tenant_id,
           key mng.company_code,
           key mng.org_type_code,
           key mng.org_code,
           key cm_org.org_name,
           mng.evaluation_op_unt_person_empno
    FROM   opUnitManager mng
          ,opUnitMst     org
          ,operationOrg  cm_org
    WHERE  mng.tenant_id        = org.tenant_id
    AND    mng.company_code     = org.company_code
    AND    mng.org_type_code    = org.org_type_code
    AND    mng.org_code         = org.org_code
    AND    cm_org.tenant_id     = mng.tenant_id
    AND    cm_org.company_code  = mng.company_code
    AND    cm_org.org_type_code = mng.org_type_code
    AND    cm_org.org_code      = mng.org_code    
    AND    mng.evaluation_execute_role_code = 'MAIN';

    /* User's Evaluation Unit. (Condition) */
    view UserEvalUnitView as
    SELECT key mng.tenant_id,
           key mng.company_code,
           key mng.org_type_code,
           key mng.org_code,
           key mng.evaluation_operation_unit_code,
           org.evaluation_operation_unit_name,
           key mng.evaluation_op_unt_person_empno
    FROM   opUnitManager mng
          ,opUnitMst     org
    WHERE  mng.tenant_id = org.tenant_id
    AND    mng.company_code = org.company_code
    AND    mng.org_type_code = org.org_type_code
    AND    mng.org_code = org.org_code
    AND    mng.evaluation_operation_unit_code = org.evaluation_operation_unit_code;

    /* User's Operation Unit */
    entity UserOperationUnit as projection on opUnitMst;

    /* User's Eval Type */
    entity UserEvalType as projection on evalType;
    /*Scale */
    entity EvalItemScle as projection on evalItemOpt;
    
    /*Quantitative Calc Code*/
    entity QttiveItemCode as projection on qttiveItem;

    /* Eval Item List View */
    view EvalItemListView as
    SELECT etv.parent_id,
           etv.node_id,
           key etv.tenant_id,
           key etv.company_code,
           key etv.org_type_code,
           key etv.org_code,
           key etv.evaluation_operation_unit_code,     /*운영단위코드*/
           oum.evaluation_operation_unit_name,     /*운영단위명*/
           key etv.evaluation_type_code,               /*평가유형코드*/
           sset.evaluation_type_name,              /*평가유형명*/
           key etv.evaluation_article_code,            /*평가항목코드*/
           etv.evaluation_article_name,            /*평가항목*/
           etv.parent_evaluation_article_code,     /*상위평가항목*/
           etv.evaluation_execute_mode_code,       /*평가수행방식코드*/
           cv_art.code_name AS evaluation_execute_mode_name, /*평가수행방식코드명*/
           etv.evaluation_article_type_code,       /*평가항목구분코드*/
           cv_art2.code_name AS evaluation_article_type_name, /*평가항목구분코드명*/
           etv.evaluation_distrb_scr_type_cd,      /*평가배분점수유형코드*/
           cv_scr.code_name AS evaluation_distrb_scr_type_name,      /*평가배분점수유형코드명*/
           etv.evaluation_result_input_type_cd,    /*Scale유형코드*/
           cv_scle.code_name AS evaluation_result_input_type_name, /*Scale유형코드명*/
           etv.evaluation_article_desc,            /*평가항목설명*/
           etv.evaluation_article_lvl_attr_cd,     /*Node 유형*/
           etv.qttive_item_uom_code,               /*단위*/
           etv.qttive_eval_article_calc_formula,   /*정량항목산식*/
           sp_se_get_qttive_eval_calc_item_name_func(etv.tenant_id
                                                    ,etv.company_code
                                                    ,etv.org_type_code
                                                    ,etv.org_code
                                                    ,etv.evaluation_operation_unit_code
                                                    ,etv.qttive_eval_article_calc_formula
                                                    )  AS qttive_eval_article_calc_formula_name : String(3000), /*정량항목산식_명 */
           etv.writer,                             /*작성자*/
           etv.write_tm,                           /*작성일자*/
           etv.sort_sequence,
           etv.evaluation_article_path_sequence,
           etv.evaluation_article_path_code,
           etv.evaluation_article_path_name,
           etv.higher_level_path_name,
           etv.evaluation_article_display_name,
           etv.evaluation_article_level1_code,
           etv.evaluation_article_level2_code,
           etv.evaluation_article_level3_code,
           etv.evaluation_article_level4_code,
           etv.evaluation_article_level5_code,
           etv.evaluation_article_level1_name,
           etv.evaluation_article_level2_name,
           etv.evaluation_article_level3_name,
           etv.evaluation_article_level4_name,
           etv.evaluation_article_level5_name,
           etv.hierarchy_rank,            /*현재node의 순번(sibling order by에 의한)*/
           etv.hierarchy_tree_size,       /*현재node포함 하위node 갯수(1이면 leaf node(마지막node))*/
           etv.hierarchy_parent_rank,     /*부모node의 순번*/
           etv.hierarchy_level,           /*현재node의 Level*/
           etv.hierarchy_root_rank,       /*root node의 순번*/
           etv.hierarchy_is_cycle,        /*순환구조여부(0:False, 1:True)*/
           etv.hierarchy_is_orphan,       /*전개후 연결이 끊어진 노드여부(0:False, 1:True)*/
           CASE WHEN etv.hierarchy_tree_size = 1 THEN 'leaf' ELSE 'expanded' END AS drill_state : String(10),
           CASE WHEN etv.evaluation_article_lvl_attr_cd = 'ITEM' AND etv.hierarchy_tree_size = 1 THEN 'Y' ELSE 'N' END AS leaf_flag : String(1),
           key etv.tenant_id||etv.company_code||etv.org_code||etv.evaluation_type_code||etv.evaluation_article_code AS ref_key : String(500) /*상세참조키*/
    FROM  exportTreeView etv
          INNER JOIN opUnitMst oum
          ON   etv.tenant_id     = oum.tenant_id
          AND  etv.company_code  = oum.company_code
          AND  etv.org_type_code = oum.org_type_code
          AND  etv.org_code      = oum.org_code
          AND  etv.evaluation_operation_unit_code = oum.evaluation_operation_unit_code
          INNER JOIN evalType sset
          ON   etv.tenant_id     = sset.tenant_id
          AND  etv.company_code  = sset.company_code
          AND  etv.org_type_code = sset.org_type_code
          AND  etv.org_code      = sset.org_code
          AND  etv.evaluation_operation_unit_code = sset.evaluation_operation_unit_code
          AND  etv.evaluation_type_code = sset.evaluation_type_code
          LEFT OUTER JOIN codeView cv_art
          ON   cv_art.tenant_id  = etv.tenant_id
          AND  cv_art.group_code = 'SP_SE_EVAL_ARTICLE_TYPE_CODE'
          AND  cv_art.code       = etv.evaluation_execute_mode_code
          AND  cv_art.language_cd = 'KO'
          LEFT OUTER JOIN codeView cv_art2
          ON   cv_art2.tenant_id  = etv.tenant_id
          AND  cv_art2.group_code = 'SP_SE_EVAL_ARTICLE_TYPE_CODE'
          AND  cv_art2.code       = etv.evaluation_article_type_code
          AND  cv_art2.language_cd = 'KO'
          LEFT OUTER JOIN codeView cv_scr
          ON   cv_scr.tenant_id  = etv.tenant_id
          AND  cv_scr.group_code = 'SP_SE_EVAL_DISTRB_SCR_TYPE_CD'
          AND  cv_scr.code       = etv.evaluation_distrb_scr_type_cd
          AND  cv_scr.language_cd = 'KO'
          LEFT OUTER JOIN codeView cv_scle
          ON   cv_scle.tenant_id  = etv.tenant_id
          AND  cv_scle.group_code = 'SP_SE_EVAL_SCALE_TYPE_CD'
          AND  cv_scle.code       = etv.evaluation_result_input_type_cd
          AND  cv_scle.language_cd = 'KO';

}