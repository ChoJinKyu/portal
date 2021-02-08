namespace xx;

using {xx.Sample_V2_H as header} from './XX_SAMPLE_V2_H-model';

entity Sample_V2_M {
  key m_id : Integer64;
  m_cd : String;
  m_name : String;
  headers : Association to many header on headers.m_id = m_id;
}
