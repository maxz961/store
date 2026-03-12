export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Props {
  items: BreadcrumbItem[];
}
