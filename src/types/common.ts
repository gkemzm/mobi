export interface ServercomponentPropType {
  params: { [key: string]: string };
  searchParams: Record<string, string | string[] | undefined>;
}
