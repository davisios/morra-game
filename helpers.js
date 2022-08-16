import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib('ALGO');
export const toStandardCurrency =(value)=>  reach.formatCurrency(value, 4);