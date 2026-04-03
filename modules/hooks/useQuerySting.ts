import { ParamsType } from "@/types/common";

const useQueryString = (params: ParamsType) => {
  const queryString = new URLSearchParams();

  Object.entries(params.searchParams ?? {}).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => queryString.append(key, v));
    } else {
      queryString.append(key, value);
    }
  });

  return [queryString];
};

export default useQueryString;
