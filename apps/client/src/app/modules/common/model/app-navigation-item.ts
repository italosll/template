export class NavigationItemModel {
  public title: string;
  public icon?: string;
  public path: string;
  public active: boolean;
  public visible: boolean;
  public enabled: boolean;
  public permission?: string;

  constructor(
    title: string,
    path: string,
    icon?: string,
    active = false,
    visible = true,
    enabled = true,
    permission?: string
  ) {
    this.title = title;
    this.icon = icon;
    this.path = path;
    this.active = active;
    this.visible = visible;
    this.enabled = enabled;
    this.permission = permission;
  }
}
