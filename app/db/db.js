import NeDB from 'nedb'
import { 
  DATABASE_PATH,
  DOCUMENT_TYPE_USER_INFO 
} from './constants'

export default new NeDB({ filename: DATABASE_PATH, autoload: true })
