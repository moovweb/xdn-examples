import { Router } from '../router';
import { EdgeConfig } from './types';
/**
 * Creates an outer edge manager config for the specified router by iterating through
 * each route and calling it with a mock request
 * and response.
 * @param {Router} router
 * @return {EdgeConfig} An object containing the Edge config
 */
export default function createEdgeConfig(router: Router): EdgeConfig;
