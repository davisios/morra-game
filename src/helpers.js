import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);

export const toStandardCurrency =(value)=>  reach.formatCurrency(value, 4);