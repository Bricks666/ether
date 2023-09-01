import { createStore } from 'effector';
import { User } from '../api';

export const $user = createStore<User | null>(null);
export const $isAuth = $user.map(Boolean);
