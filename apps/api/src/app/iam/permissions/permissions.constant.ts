import { PermissionDTO } from "./permission.dto";
import { Action } from "./permissions-actions.enum";
import { Resource } from "./permissions-resources.enum";

export const PERMISSIONS = [    
    // Product permissions
    new PermissionDTO(Resource.PRODUCT, Action.CREATE),
    new PermissionDTO(Resource.PRODUCT, Action.READ),
    new PermissionDTO(Resource.PRODUCT, Action.UPDATE),
    new PermissionDTO(Resource.PRODUCT, Action.DELETE),

    // User permissions
    new PermissionDTO(Resource.USER, Action.CREATE),
    new PermissionDTO(Resource.USER, Action.READ),
    new PermissionDTO(Resource.USER, Action.UPDATE),
    new PermissionDTO(Resource.USER, Action.DELETE),

    // Company permissions
    // new PermissionDTO(Resource.COMPANY, Action.CREATE),
    // new PermissionDTO(Resource.COMPANY, Action.READ),
    // new PermissionDTO(Resource.COMPANY, Action.UPDATE),
    // new PermissionDTO(Resource.COMPANY, Action.DELETE),
]