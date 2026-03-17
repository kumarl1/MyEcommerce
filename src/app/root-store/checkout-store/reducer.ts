import { ActionTypes, checkoutAction } from './actions';
import { initialState } from './state';

export function featureReducer(state = initialState, action: checkoutAction) {
  switch(action.type) {
    case ActionTypes.increase:
      return {
        ...state,
        count: state.count + 1
      }

      case ActionTypes.decrease:
        return {
          ...state,
          count: state.count > 0 ? state.count -1 : 0
        }
      default:
       return state;
  }
}