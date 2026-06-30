/**
 * RBAC permission constants — Sprint 2+ (Roles & Permissions).
 *
 * @example
 * export const PERMISSIONS = {
 *   INVENTORY_READ: 'inventory:read',
 *   INVENTORY_WRITE: 'inventory:write',
 *   POS_CHECKOUT: 'pos:checkout',
 * } as const;
 */

export const PERMISSIONS = {} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
