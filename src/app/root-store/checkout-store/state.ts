export type State = CheckoutState;

export interface CheckoutState {
    count: number;
}

export const initialState: CheckoutState = {
    count: JSON.parse(localStorage.getItem('user_cartProducts')) ? JSON.parse(localStorage.getItem('user_cartProducts')).length : 0
}