import { PermissionContract } from "@interfaces/permission.contract";

export class PermissionDTO implements PermissionContract {
    constructor(
        public resource: string,
        public action: string
    ) {}
}