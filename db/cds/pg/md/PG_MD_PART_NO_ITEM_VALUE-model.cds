namespace pg;

using util from '../../cm/util/util-model';


entity Md_Part_No_Item_Value {
    key tenant_id        : String(5) not null  @title : '테넌트ID';
    key company_code     : String(10) not null @title : '회사코드';
    key org_type_code    : String(30) not null @title : '조직유형코드';
    key org_code         : String(10) not null @title : '조직코드';
    key vendor_pool_code : String(20) not null @title : '협력사풀코드';
    key material_code    : String(40) not null @title : '자재코드';
    key supplier_code    : String(10) not null @title : '공급업체코드';
        use_flag         : Boolean not null    @title : '사용여부';
        spmd_attr_001    : String(100)         @title : 'spmd_attr_001';
        spmd_attr_002    : String(100)         @title : 'spmd_attr_002';
        spmd_attr_003    : String(100)         @title : 'spmd_attr_003';
        spmd_attr_004    : String(100)         @title : 'spmd_attr_004';
        spmd_attr_005    : String(100)         @title : 'spmd_attr_005';
        spmd_attr_006    : String(100)         @title : 'spmd_attr_006';
        spmd_attr_007    : String(100)         @title : 'spmd_attr_007';
        spmd_attr_008    : String(100)         @title : 'spmd_attr_008';
        spmd_attr_009    : String(100)         @title : 'spmd_attr_009';
        spmd_attr_010    : String(100)         @title : 'spmd_attr_010';
        spmd_attr_011    : String(100)         @title : 'spmd_attr_011';
        spmd_attr_012    : String(100)         @title : 'spmd_attr_012';
        spmd_attr_013    : String(100)         @title : 'spmd_attr_013';
        spmd_attr_014    : String(100)         @title : 'spmd_attr_014';
        spmd_attr_015    : String(100)         @title : 'spmd_attr_015';
        spmd_attr_016    : String(100)         @title : 'spmd_attr_016';
        spmd_attr_017    : String(100)         @title : 'spmd_attr_017';
        spmd_attr_018    : String(100)         @title : 'spmd_attr_018';
        spmd_attr_019    : String(100)         @title : 'spmd_attr_019';
        spmd_attr_020    : String(100)         @title : 'spmd_attr_020';
        spmd_attr_021    : String(100)         @title : 'spmd_attr_021';
        spmd_attr_022    : String(100)         @title : 'spmd_attr_022';
        spmd_attr_023    : String(100)         @title : 'spmd_attr_023';
        spmd_attr_024    : String(100)         @title : 'spmd_attr_024';
        spmd_attr_025    : String(100)         @title : 'spmd_attr_025';
        spmd_attr_026    : String(100)         @title : 'spmd_attr_026';
        spmd_attr_027    : String(100)         @title : 'spmd_attr_027';
        spmd_attr_028    : String(100)         @title : 'spmd_attr_028';
        spmd_attr_029    : String(100)         @title : 'spmd_attr_029';
        spmd_attr_030    : String(100)         @title : 'spmd_attr_030';
        spmd_attr_031    : String(100)         @title : 'spmd_attr_031';
        spmd_attr_032    : String(100)         @title : 'spmd_attr_032';
        spmd_attr_033    : String(100)         @title : 'spmd_attr_033';
        spmd_attr_034    : String(100)         @title : 'spmd_attr_034';
        spmd_attr_035    : String(100)         @title : 'spmd_attr_035';
        spmd_attr_036    : String(100)         @title : 'spmd_attr_036';
        spmd_attr_037    : String(100)         @title : 'spmd_attr_037';
        spmd_attr_038    : String(100)         @title : 'spmd_attr_038';
        spmd_attr_039    : String(100)         @title : 'spmd_attr_039';
        spmd_attr_040    : String(100)         @title : 'spmd_attr_040';
        spmd_attr_041    : String(100)         @title : 'spmd_attr_041';
        spmd_attr_042    : String(100)         @title : 'spmd_attr_042';
        spmd_attr_043    : String(100)         @title : 'spmd_attr_043';
        spmd_attr_044    : String(100)         @title : 'spmd_attr_044';
        spmd_attr_045    : String(100)         @title : 'spmd_attr_045';
        spmd_attr_046    : String(100)         @title : 'spmd_attr_046';
        spmd_attr_047    : String(100)         @title : 'spmd_attr_047';
        spmd_attr_048    : String(100)         @title : 'spmd_attr_048';
        spmd_attr_049    : String(100)         @title : 'spmd_attr_049';
        spmd_attr_050    : String(100)         @title : 'spmd_attr_050';
        spmd_attr_051    : String(100)         @title : 'spmd_attr_051';
        spmd_attr_052    : String(100)         @title : 'spmd_attr_052';
        spmd_attr_053    : String(100)         @title : 'spmd_attr_053';
        spmd_attr_054    : String(100)         @title : 'spmd_attr_054';
        spmd_attr_055    : String(100)         @title : 'spmd_attr_055';
        spmd_attr_056    : String(100)         @title : 'spmd_attr_056';
        spmd_attr_057    : String(100)         @title : 'spmd_attr_057';
        spmd_attr_058    : String(100)         @title : 'spmd_attr_058';
        spmd_attr_059    : String(100)         @title : 'spmd_attr_059';
        spmd_attr_060    : String(100)         @title : 'spmd_attr_060';
        spmd_attr_061    : String(100)         @title : 'spmd_attr_061';
        spmd_attr_062    : String(100)         @title : 'spmd_attr_062';
        spmd_attr_063    : String(100)         @title : 'spmd_attr_063';
        spmd_attr_064    : String(100)         @title : 'spmd_attr_064';
        spmd_attr_065    : String(100)         @title : 'spmd_attr_065';
        spmd_attr_066    : String(100)         @title : 'spmd_attr_066';
        spmd_attr_067    : String(100)         @title : 'spmd_attr_067';
        spmd_attr_068    : String(100)         @title : 'spmd_attr_068';
        spmd_attr_069    : String(100)         @title : 'spmd_attr_069';
        spmd_attr_070    : String(100)         @title : 'spmd_attr_070';
        spmd_attr_071    : String(100)         @title : 'spmd_attr_071';
        spmd_attr_072    : String(100)         @title : 'spmd_attr_072';
        spmd_attr_073    : String(100)         @title : 'spmd_attr_073';
        spmd_attr_074    : String(100)         @title : 'spmd_attr_074';
        spmd_attr_075    : String(100)         @title : 'spmd_attr_075';
        spmd_attr_076    : String(100)         @title : 'spmd_attr_076';
        spmd_attr_077    : String(100)         @title : 'spmd_attr_077';
        spmd_attr_078    : String(100)         @title : 'spmd_attr_078';
        spmd_attr_079    : String(100)         @title : 'spmd_attr_079';
        spmd_attr_080    : String(100)         @title : 'spmd_attr_080';
        spmd_attr_081    : String(100)         @title : 'spmd_attr_081';
        spmd_attr_082    : String(100)         @title : 'spmd_attr_082';
        spmd_attr_083    : String(100)         @title : 'spmd_attr_083';
        spmd_attr_084    : String(100)         @title : 'spmd_attr_084';
        spmd_attr_085    : String(100)         @title : 'spmd_attr_085';
        spmd_attr_086    : String(100)         @title : 'spmd_attr_086';
        spmd_attr_087    : String(100)         @title : 'spmd_attr_087';
        spmd_attr_088    : String(100)         @title : 'spmd_attr_088';
        spmd_attr_089    : String(100)         @title : 'spmd_attr_089';
        spmd_attr_090    : String(100)         @title : 'spmd_attr_090';
        spmd_attr_091    : String(100)         @title : 'spmd_attr_091';
        spmd_attr_092    : String(100)         @title : 'spmd_attr_092';
        spmd_attr_093    : String(100)         @title : 'spmd_attr_093';
        spmd_attr_094    : String(100)         @title : 'spmd_attr_094';
        spmd_attr_095    : String(100)         @title : 'spmd_attr_095';
        spmd_attr_096    : String(100)         @title : 'spmd_attr_096';
        spmd_attr_097    : String(100)         @title : 'spmd_attr_097';
        spmd_attr_098    : String(100)         @title : 'spmd_attr_098';
        spmd_attr_099    : String(100)         @title : 'spmd_attr_099';
        spmd_attr_100    : String(100)         @title : 'spmd_attr_100';
        spmd_attr_101    : String(100)         @title : 'spmd_attr_101';
        spmd_attr_102    : String(100)         @title : 'spmd_attr_102';
        spmd_attr_103    : String(100)         @title : 'spmd_attr_103';
        spmd_attr_104    : String(100)         @title : 'spmd_attr_104';
        spmd_attr_105    : String(100)         @title : 'spmd_attr_105';
        spmd_attr_106    : String(100)         @title : 'spmd_attr_106';
        spmd_attr_107    : String(100)         @title : 'spmd_attr_107';
        spmd_attr_108    : String(100)         @title : 'spmd_attr_108';
        spmd_attr_109    : String(100)         @title : 'spmd_attr_109';
        spmd_attr_110    : String(100)         @title : 'spmd_attr_110';
        spmd_attr_111    : String(100)         @title : 'spmd_attr_111';
        spmd_attr_112    : String(100)         @title : 'spmd_attr_112';
        spmd_attr_113    : String(100)         @title : 'spmd_attr_113';
        spmd_attr_114    : String(100)         @title : 'spmd_attr_114';
        spmd_attr_115    : String(100)         @title : 'spmd_attr_115';
        spmd_attr_116    : String(100)         @title : 'spmd_attr_116';
        spmd_attr_117    : String(100)         @title : 'spmd_attr_117';
        spmd_attr_118    : String(100)         @title : 'spmd_attr_118';
        spmd_attr_119    : String(100)         @title : 'spmd_attr_119';
        spmd_attr_120    : String(100)         @title : 'spmd_attr_120';
        spmd_attr_121    : String(100)         @title : 'spmd_attr_121';
        spmd_attr_122    : String(100)         @title : 'spmd_attr_122';
        spmd_attr_123    : String(100)         @title : 'spmd_attr_123';
        spmd_attr_124    : String(100)         @title : 'spmd_attr_124';
        spmd_attr_125    : String(100)         @title : 'spmd_attr_125';
        spmd_attr_126    : String(100)         @title : 'spmd_attr_126';
        spmd_attr_127    : String(100)         @title : 'spmd_attr_127';
        spmd_attr_128    : String(100)         @title : 'spmd_attr_128';
        spmd_attr_129    : String(100)         @title : 'spmd_attr_129';
        spmd_attr_130    : String(100)         @title : 'spmd_attr_130';
        spmd_attr_131    : String(100)         @title : 'spmd_attr_131';
        spmd_attr_132    : String(100)         @title : 'spmd_attr_132';
        spmd_attr_133    : String(100)         @title : 'spmd_attr_133';
        spmd_attr_134    : String(100)         @title : 'spmd_attr_134';
        spmd_attr_135    : String(100)         @title : 'spmd_attr_135';
        spmd_attr_136    : String(100)         @title : 'spmd_attr_136';
        spmd_attr_137    : String(100)         @title : 'spmd_attr_137';
        spmd_attr_138    : String(100)         @title : 'spmd_attr_138';
        spmd_attr_139    : String(100)         @title : 'spmd_attr_139';
        spmd_attr_140    : String(100)         @title : 'spmd_attr_140';
        spmd_attr_141    : String(100)         @title : 'spmd_attr_141';
        spmd_attr_142    : String(100)         @title : 'spmd_attr_142';
        spmd_attr_143    : String(100)         @title : 'spmd_attr_143';
        spmd_attr_144    : String(100)         @title : 'spmd_attr_144';
        spmd_attr_145    : String(100)         @title : 'spmd_attr_145';
        spmd_attr_146    : String(100)         @title : 'spmd_attr_146';
        spmd_attr_147    : String(100)         @title : 'spmd_attr_147';
        spmd_attr_148    : String(100)         @title : 'spmd_attr_148';
        spmd_attr_149    : String(100)         @title : 'spmd_attr_149';
        spmd_attr_150    : String(100)         @title : 'spmd_attr_150';
        spmd_attr_151    : String(100)         @title : 'spmd_attr_151';
        spmd_attr_152    : String(100)         @title : 'spmd_attr_152';
        spmd_attr_153    : String(100)         @title : 'spmd_attr_153';
        spmd_attr_154    : String(100)         @title : 'spmd_attr_154';
        spmd_attr_155    : String(100)         @title : 'spmd_attr_155';
        spmd_attr_156    : String(100)         @title : 'spmd_attr_156';
        spmd_attr_157    : String(100)         @title : 'spmd_attr_157';
        spmd_attr_158    : String(100)         @title : 'spmd_attr_158';
        spmd_attr_159    : String(100)         @title : 'spmd_attr_159';
        spmd_attr_160    : String(100)         @title : 'spmd_attr_160';
        spmd_attr_161    : String(100)         @title : 'spmd_attr_161';
        spmd_attr_162    : String(100)         @title : 'spmd_attr_162';
        spmd_attr_163    : String(100)         @title : 'spmd_attr_163';
        spmd_attr_164    : String(100)         @title : 'spmd_attr_164';
        spmd_attr_165    : String(100)         @title : 'spmd_attr_165';
        spmd_attr_166    : String(100)         @title : 'spmd_attr_166';
        spmd_attr_167    : String(100)         @title : 'spmd_attr_167';
        spmd_attr_168    : String(100)         @title : 'spmd_attr_168';
        spmd_attr_169    : String(100)         @title : 'spmd_attr_169';
        spmd_attr_170    : String(100)         @title : 'spmd_attr_170';
        spmd_attr_171    : String(100)         @title : 'spmd_attr_171';
        spmd_attr_172    : String(100)         @title : 'spmd_attr_172';
        spmd_attr_173    : String(100)         @title : 'spmd_attr_173';
        spmd_attr_174    : String(100)         @title : 'spmd_attr_174';
        spmd_attr_175    : String(100)         @title : 'spmd_attr_175';
        spmd_attr_176    : String(100)         @title : 'spmd_attr_176';
        spmd_attr_177    : String(100)         @title : 'spmd_attr_177';
        spmd_attr_178    : String(100)         @title : 'spmd_attr_178';
        spmd_attr_179    : String(100)         @title : 'spmd_attr_179';
        spmd_attr_180    : String(100)         @title : 'spmd_attr_180';
        spmd_attr_181    : String(100)         @title : 'spmd_attr_181';
        spmd_attr_182    : String(100)         @title : 'spmd_attr_182';
        spmd_attr_183    : String(100)         @title : 'spmd_attr_183';
        spmd_attr_184    : String(100)         @title : 'spmd_attr_184';
        spmd_attr_185    : String(100)         @title : 'spmd_attr_185';
        spmd_attr_186    : String(100)         @title : 'spmd_attr_186';
        spmd_attr_187    : String(100)         @title : 'spmd_attr_187';
        spmd_attr_188    : String(100)         @title : 'spmd_attr_188';
        spmd_attr_189    : String(100)         @title : 'spmd_attr_189';
        spmd_attr_190    : String(100)         @title : 'spmd_attr_190';
        spmd_attr_191    : String(100)         @title : 'spmd_attr_191';
        spmd_attr_192    : String(100)         @title : 'spmd_attr_192';
        spmd_attr_193    : String(100)         @title : 'spmd_attr_193';
        spmd_attr_194    : String(100)         @title : 'spmd_attr_194';
        spmd_attr_195    : String(100)         @title : 'spmd_attr_195';
        spmd_attr_196    : String(100)         @title : 'spmd_attr_196';
        spmd_attr_197    : String(100)         @title : 'spmd_attr_197';
        spmd_attr_198    : String(100)         @title : 'spmd_attr_198';
        spmd_attr_199    : String(100)         @title : 'spmd_attr_199';
        spmd_attr_200    : String(100)         @title : 'spmd_attr_200';
        spmd_attr_201    : String(100)         @title : 'spmd_attr_201';
        spmd_attr_202    : String(100)         @title : 'spmd_attr_202';
        spmd_attr_203    : String(100)         @title : 'spmd_attr_203';
        spmd_attr_204    : String(100)         @title : 'spmd_attr_204';
        spmd_attr_205    : String(100)         @title : 'spmd_attr_205';
        spmd_attr_206    : String(100)         @title : 'spmd_attr_206';
        spmd_attr_207    : String(100)         @title : 'spmd_attr_207';
        spmd_attr_208    : String(100)         @title : 'spmd_attr_208';
        spmd_attr_209    : String(100)         @title : 'spmd_attr_209';
        spmd_attr_210    : String(100)         @title : 'spmd_attr_210';
        spmd_attr_211    : String(100)         @title : 'spmd_attr_211';
        spmd_attr_212    : String(100)         @title : 'spmd_attr_212';
        spmd_attr_213    : String(100)         @title : 'spmd_attr_213';
        spmd_attr_214    : String(100)         @title : 'spmd_attr_214';
        spmd_attr_215    : String(100)         @title : 'spmd_attr_215';
        spmd_attr_216    : String(100)         @title : 'spmd_attr_216';
        spmd_attr_217    : String(100)         @title : 'spmd_attr_217';
        spmd_attr_218    : String(100)         @title : 'spmd_attr_218';
        spmd_attr_219    : String(100)         @title : 'spmd_attr_219';
        spmd_attr_220    : String(100)         @title : 'spmd_attr_220';
        spmd_attr_221    : String(100)         @title : 'spmd_attr_221';
        spmd_attr_222    : String(100)         @title : 'spmd_attr_222';
        spmd_attr_223    : String(100)         @title : 'spmd_attr_223';
        spmd_attr_224    : String(100)         @title : 'spmd_attr_224';
        spmd_attr_225    : String(100)         @title : 'spmd_attr_225';
        spmd_attr_226    : String(100)         @title : 'spmd_attr_226';
        spmd_attr_227    : String(100)         @title : 'spmd_attr_227';
        spmd_attr_228    : String(100)         @title : 'spmd_attr_228';
        spmd_attr_229    : String(100)         @title : 'spmd_attr_229';
        spmd_attr_230    : String(100)         @title : 'spmd_attr_230';
        spmd_attr_231    : String(100)         @title : 'spmd_attr_231';
        spmd_attr_232    : String(100)         @title : 'spmd_attr_232';
        spmd_attr_233    : String(100)         @title : 'spmd_attr_233';
        spmd_attr_234    : String(100)         @title : 'spmd_attr_234';
        spmd_attr_235    : String(100)         @title : 'spmd_attr_235';
        spmd_attr_236    : String(100)         @title : 'spmd_attr_236';
        spmd_attr_237    : String(100)         @title : 'spmd_attr_237';
        spmd_attr_238    : String(100)         @title : 'spmd_attr_238';
        spmd_attr_239    : String(100)         @title : 'spmd_attr_239';
        spmd_attr_240    : String(100)         @title : 'spmd_attr_240';
        spmd_attr_241    : String(100)         @title : 'spmd_attr_241';
        spmd_attr_242    : String(100)         @title : 'spmd_attr_242';
        spmd_attr_243    : String(100)         @title : 'spmd_attr_243';
        spmd_attr_244    : String(100)         @title : 'spmd_attr_244';
        spmd_attr_245    : String(100)         @title : 'spmd_attr_245';
        spmd_attr_246    : String(100)         @title : 'spmd_attr_246';
        spmd_attr_247    : String(100)         @title : 'spmd_attr_247';
        spmd_attr_248    : String(100)         @title : 'spmd_attr_248';
        spmd_attr_249    : String(100)         @title : 'spmd_attr_249';
        spmd_attr_250    : String(100)         @title : 'spmd_attr_250';
        spmd_attr_251    : String(100)         @title : 'spmd_attr_251';
        spmd_attr_252    : String(100)         @title : 'spmd_attr_252';
        spmd_attr_253    : String(100)         @title : 'spmd_attr_253';
        spmd_attr_254    : String(100)         @title : 'spmd_attr_254';
        spmd_attr_255    : String(100)         @title : 'spmd_attr_255';
        spmd_attr_256    : String(100)         @title : 'spmd_attr_256';
        spmd_attr_257    : String(100)         @title : 'spmd_attr_257';
        spmd_attr_258    : String(100)         @title : 'spmd_attr_258';
        spmd_attr_259    : String(100)         @title : 'spmd_attr_259';
        spmd_attr_260    : String(100)         @title : 'spmd_attr_260';
        spmd_attr_261    : String(100)         @title : 'spmd_attr_261';
        spmd_attr_262    : String(100)         @title : 'spmd_attr_262';
        spmd_attr_263    : String(100)         @title : 'spmd_attr_263';
        spmd_attr_264    : String(100)         @title : 'spmd_attr_264';
        spmd_attr_265    : String(100)         @title : 'spmd_attr_265';
        spmd_attr_266    : String(100)         @title : 'spmd_attr_266';
        spmd_attr_267    : String(100)         @title : 'spmd_attr_267';
        spmd_attr_268    : String(100)         @title : 'spmd_attr_268';
        spmd_attr_269    : String(100)         @title : 'spmd_attr_269';
        spmd_attr_270    : String(100)         @title : 'spmd_attr_270';
        spmd_attr_271    : String(100)         @title : 'spmd_attr_271';
        spmd_attr_272    : String(100)         @title : 'spmd_attr_272';
        spmd_attr_273    : String(100)         @title : 'spmd_attr_273';
        spmd_attr_274    : String(100)         @title : 'spmd_attr_274';
        spmd_attr_275    : String(100)         @title : 'spmd_attr_275';
        spmd_attr_276    : String(100)         @title : 'spmd_attr_276';
        spmd_attr_277    : String(100)         @title : 'spmd_attr_277';
        spmd_attr_278    : String(100)         @title : 'spmd_attr_278';
        spmd_attr_279    : String(100)         @title : 'spmd_attr_279';
        spmd_attr_280    : String(100)         @title : 'spmd_attr_280';
        spmd_attr_281    : String(100)         @title : 'spmd_attr_281';
        spmd_attr_282    : String(100)         @title : 'spmd_attr_282';
        spmd_attr_283    : String(100)         @title : 'spmd_attr_283';
        spmd_attr_284    : String(100)         @title : 'spmd_attr_284';
        spmd_attr_285    : String(100)         @title : 'spmd_attr_285';
        spmd_attr_286    : String(100)         @title : 'spmd_attr_286';
        spmd_attr_287    : String(100)         @title : 'spmd_attr_287';
        spmd_attr_288    : String(100)         @title : 'spmd_attr_288';
        spmd_attr_289    : String(100)         @title : 'spmd_attr_289';
        spmd_attr_290    : String(100)         @title : 'spmd_attr_290';
        spmd_attr_291    : String(100)         @title : 'spmd_attr_291';
        spmd_attr_292    : String(100)         @title : 'spmd_attr_292';
        spmd_attr_293    : String(100)         @title : 'spmd_attr_293';
        spmd_attr_294    : String(100)         @title : 'spmd_attr_294';
        spmd_attr_295    : String(100)         @title : 'spmd_attr_295';
        spmd_attr_296    : String(100)         @title : 'spmd_attr_296';
        spmd_attr_297    : String(100)         @title : 'spmd_attr_297';
        spmd_attr_298    : String(100)         @title : 'spmd_attr_298';
        spmd_attr_299    : String(100)         @title : 'spmd_attr_299';
        spmd_attr_300    : String(100)         @title : 'spmd_attr_300';

}


extend Md_Part_No_Item_Value with util.Managed;