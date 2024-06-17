export type Pagination<F> = {
  pagination: { skip: number; take: number };
  filters: F;
};
