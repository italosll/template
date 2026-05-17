export class PermissionDTO {
    constructor(
        public resource: string,
        public action: string,
    ){}
}