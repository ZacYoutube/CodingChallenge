import { createStore } from 'redux'
import reducers from '../reducer/combinedReducer';

const store = createStore(reducers);
export default store