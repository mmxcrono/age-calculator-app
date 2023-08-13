import { createRouter, createWebHashHistory } from 'vue-router';
import AgeCalculator from './pages/AgeCalculator.vue';

const routes = [{ path: '/', component: AgeCalculator }];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
